import { makeExecutableSchema } from 'graphql-tools';

import { resolvers } from './resolvers';

export const typeDefs = `
  # declare custom scalars
  scalar Date

  # input for file types
  input File {
    name: String!
    type: String!
    size: Int!
    path: String!
  }

  # input for creating messages
  input CreateMessageInput {
    groupId: Int!
    text: String!
  }

  # input for creating groups
  input CreateGroupInput {
    name: String!
    userIds: [Int!]
    icon: File # group icon image
  }

  # input for updating groups
  input UpdateGroupInput {
    id: Int!
    lastRead: Int
    name: String
    userIds: [Int!]
    icon: File # group icom image
  }

  # input for signing in users
  input SigninUserInput {
    email: String!
    password: String!
    username: String
  }

  # input for updating users
  input UpdateUserInput {
    avatar: File
    badgeCount: Int
    username: String
    registrationId: String
  }

  # input for relay cursor connections
  input ConnectionInput {
    first: Int
    after: String
    last: Int
    before: String
  }

  type MessageConnection {
    edges: [MessageEdge]
    pageInfo: PageInfo!
  }

  type MessageEdge {
    cursor: String!
    node: Message!
  }

  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  # a group chat entity
  type Group {
    id: Int! # unique id for the group
    name: String # name of the group
    users: [User]! # users in the group
    messages(messageConnection: ConnectionInput): MessageConnection # messages sent to the group
    lastRead: Message # message last read by user
    unreadCount: Int # number of unread messages by user
    icon: String # url for icon image
  }

  # a user -- keep type really simple for now
  type User {
    id: Int! # unique id for the user
    badgeCount: Int # number of unread notifications
    email: String! # we will also require a unique email per user
    username: String # this is the name we'll show other users
    messages: [Message] # messages sent by user
    groups: [Group] # groups the user belongs to
    friends: [User] # user's friends/contacts
    jwt: String # json web token for access
    registrationId: String
    avatar: String # url for avatar image
  }

  # a message sent from a user to a group
  type Message {
    id: Int! # unique id for message
    to: Group! # group message was sent in
    from: User! # user who sent the message
    text: String! # message text
    createdAt: Date! # when message was created
  }

  type Personne {
    name: String
    visite: [Personne] @relation(name: "visite", direction: "OUT")
    blacklist: [Personne] @relation(name: "blacklist", direction: "OUT")
    favorite: [Personne] @relation(name: "favorite", direction: "OUT")
    visiteIn: [Personne] @relation(name: "visite", direction: "IN")
    blacklistIn: [Personne] @relation(name: "blacklist", direction: "IN")
    favoriteIn: [Personne] @relation(name: "favorite", direction: "IN")
    message: [Message1] @relation(name: "poster", direction: "OUT")
    from: [Message1] @relation(name: "to", direction: "OUT")
  }

  type Message1 {
    actors: [Personne] @relation(name: "poster", direction: "IN")
    to: [Personne] @relation(name: "to", direction: "IN")
    text: String
  }

  type Query {
    Personne(name: String): [Personne]
    Message1(poster: String): [Message1]
    # Return a user by their email or id
    user(email: String, id: Int): User

    # Return messages sent by a user via userId
    # Return messages sent to a group via groupId
    messages(groupId: Int, userId: Int): [Message]

    # Return a group by its id
    group(id: Int!): Group
  }

  type Mutation {
    # send a message to a group
    createMessage(message: CreateMessageInput!): Message
    createGroup(group: CreateGroupInput!): Group
    deleteGroup(id: Int!): Group
    leaveGroup(id: Int!): Group # let user leave group
    updateGroup(group: UpdateGroupInput!): Group
    updateUser(user: UpdateUserInput!): User # update registration for user
    login(user: SigninUserInput!): User
    signup(user: SigninUserInput!): User
    createPerson(name: String): Personne @cypher(statement: "CREATE (p:Personne { name: $name }) RETURN p")
    ActionPersonne(p1: String, p2: String, relation: String!): Personne
    AddMessage(actors: String!, text: String!, to: String!): Message1
  }

  type Subscription {
    # Subscription fires on every message added
    # for any of the groups with one of these groupIds
    messageAdded(groupIds: [Int]): Message
    groupAdded(userId: Int): Group
  }

`;

export const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

