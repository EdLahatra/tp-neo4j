import GraphQLDate from 'graphql-date';
import { withFilter } from 'graphql-subscriptions';
import { map } from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { pubsub } from '../../subscriptions';
import { groupLogic, messageLogic, userLogic } from './../../data/logic';
import { neo4jgraphql } from '../neo4j-graphql-js/index';

import { User } from './../../data/connectors';

import { JWT_SECRET } from '../../config';

const MESSAGE_ADDED_TOPIC = 'messageAdded';
const GROUP_ADDED_TOPIC = 'groupAdded';

export const resolvers = {
  // root entry point to GraphQL service
  Date: GraphQLDate,
  PageInfo: {
    // we will have each connection supply its own hasNextPage/hasPreviousPage functions!
    hasNextPage(connection) {
      return connection.hasNextPage();
    },
    hasPreviousPage(connection) {
      return connection.hasPreviousPage();
    },
  },
  Query: {
    // fetch movies by title substring
    Personne(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    Message1(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    group(_, args, ctx) {
      return groupLogic.query(_, args, ctx);
    },
    user(_, args, ctx) {
      return userLogic.query(_, args, ctx);
    },
  },
  Mutation: {
    createPerson(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    ActionPersonne(object, params, ctx, resolveInfo) {
      const paramsD = {
        ...params,
        dynamique: 'ActionPersonne',
      };
      return neo4jgraphql(object, paramsD, ctx, resolveInfo, true);
    },
    AddMessage(object, params, ctx, resolveInfo) {
      const paramsD = {
        ...params,
        dynamique: 'AddMessage',
      };
      return neo4jgraphql(object, paramsD, ctx, resolveInfo, true);
    },
    createMessage(_, args, ctx) {
      return messageLogic.createMessage(_, args, ctx)
        .then((message) => {
          // Publish subscription notification with message
          pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });
          return message;
        });
    },
    createGroup(_, args, ctx) {
      return groupLogic.createGroup(_, args, ctx).then((group) => {
        pubsub.publish(GROUP_ADDED_TOPIC, { [GROUP_ADDED_TOPIC]: group });
        return group;
      });
    },
    deleteGroup(_, args, ctx) {
      return groupLogic.deleteGroup(_, args, ctx);
    },
    leaveGroup(_, args, ctx) {
      return groupLogic.leaveGroup(_, args, ctx);
    },
    updateGroup(_, args, ctx) {
      return groupLogic.updateGroup(_, args, ctx);
    },
    updateUser(_, args, ctx) {
      return userLogic.updateUser(_, args, ctx);
    },
    login(_, signinUserInput, ctx) {
      // find user by email
      const { email, password } = signinUserInput.user;

      return User.findOne({ where: { email } }).then((user) => {
        if (user) {
          // validate password
          return bcrypt.compare(password, user.password).then((res) => {
            if (res) {
              // create jwt
              const token = jwt.sign({
                id: user.id,
                email: user.email,
                version: user.version,
              }, JWT_SECRET);
              user.jwt = token;
              ctx.user = Promise.resolve(user);
              return user;
            }

            return Promise.reject('password incorrect');
          });
        }

        return Promise.reject('email not found');
      });
    },
    signup(_, signinUserInput, ctx) {
      const { email, password, username } = signinUserInput.user;

      // find user by email
      return User.findOne({ where: { email } }).then((existing) => {
        if (!existing) {
          // hash password and create user
          return bcrypt.hash(password, 10).then(hash => User.create({
            email,
            password: hash,
            username: username || email,
            version: 1,
          })).then((user) => {
            const { id } = user;
            const token = jwt.sign({ id, email, version: 1 }, JWT_SECRET);
            user.jwt = token;
            ctx.user = Promise.resolve(user);
            return user;
          });
        }

        return Promise.reject('email already exists'); // email already exists
      });
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(MESSAGE_ADDED_TOPIC),
        (payload, args, ctx) => ctx.user.then(user => Boolean(
          args.groupIds &&
              // eslint-disable-next-line
              ~args.groupIds.indexOf(payload.messageAdded.groupId) &&
              user.id !== payload.messageAdded.userId, // don't send to user creating message
        )),
      ),
    },
    groupAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(GROUP_ADDED_TOPIC),
        (payload, args, ctx) => ctx.user.then(user => Boolean(
          args.userId &&
              // eslint-disable-next-line
              ~map(payload.groupAdded.users, 'id').indexOf(args.userId) &&
              user.id !== payload.groupAdded.users[0].id, // don't send to user creating group
        )),
      ),
    },
  },
  Group: {
    users(group, args, ctx) {
      return groupLogic.users(group, args, ctx);
    },
    messages(group, args, ctx) {
      return groupLogic.messages(group, args, ctx);
    },
    lastRead(group, args, ctx) {
      return groupLogic.lastRead(group, args, ctx);
    },
    unreadCount(group, args, ctx) {
      return groupLogic.unreadCount(group, args, ctx);
    },
    icon(user, args, ctx) {
      return groupLogic.icon(user, args, ctx);
    },
  },
  Message: {
    to(message, args, ctx) {
      return messageLogic.to(message, args, ctx);
    },
    from(message, args, ctx) {
      return messageLogic.from(message, args, ctx);
    },
  },
  User: {
    avatar(user, args, ctx) {
      return userLogic.avatar(user, args, ctx);
    },
    email(user, args, ctx) {
      return userLogic.email(user, args, ctx);
    },
    friends(user, args, ctx) {
      return userLogic.friends(user, args, ctx);
    },
    groups(user, args, ctx) {
      return userLogic.groups(user, args, ctx);
    },
    jwt(user, args, ctx) {
      return userLogic.jwt(user, args, ctx);
    },
    messages(user, args, ctx) {
      return userLogic.messages(user, args, ctx);
    },
    registrationId(user, args, ctx) {
      return userLogic.registrationId(user, args, ctx);
    },
  },
};

export const t = 't';

/* export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
}); */
