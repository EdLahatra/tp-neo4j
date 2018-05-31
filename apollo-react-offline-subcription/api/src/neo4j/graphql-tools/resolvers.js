// import { makeExecutableSchema } from 'graphql-tools';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { neo4jgraphql } from '../neo4j-graphql-js/index';

import { /* Group, Message, */ User } from './../../data/connectors';

import { JWT_SECRET } from '../../config';

// import { typeDefs } from './schemas';

export const resolvers = {
  // root entry point to GraphQL service
  Query: {
    // fetch movies by title substring
    Personne(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    Message(object, params, ctx, resolveInfo) {
      console.log('test');
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
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
  },
};

export const t = 't';

/* export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
}); */
