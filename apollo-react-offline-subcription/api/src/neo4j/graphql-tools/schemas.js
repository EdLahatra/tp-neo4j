import { makeExecutableSchema } from 'graphql-tools';

import { resolvers } from './resolvers';

export const typeDefs = `

  type Personne {
    name: String
    visite: [Personne] @relation(name: "visite", direction: "OUT")
    blacklist: [Personne] @relation(name: "blacklist", direction: "OUT")
    favorite: [Personne] @relation(name: "favorite", direction: "OUT")
    visiteIn: [Personne] @relation(name: "visite", direction: "IN")
    blacklistIn: [Personne] @relation(name: "blacklist", direction: "IN")
    favoriteIn: [Personne] @relation(name: "favorite", direction: "IN")
    message: [Message] @relation(name: "poster", direction: "OUT")
    from: [Message] @relation(name: "to", direction: "OUT")
  }

  type Message {
    actors: [Personne] @relation(name: "poster", direction: "IN")
    to: [Personne] @relation(name: "to", direction: "IN")
    text: String
  }

  type User {
    id: Int! # unique id for the user
    badgeCount: Int # number of unread notifications
    email: String! # we will also require a unique email per user
    username: String # this is the name we'll show other users
    jwt: String # json web token for access
    registrationId: String
    avatar: String # url for avatar image
  }

  type Query {
    Personne(name: String): [Personne]
    Message(poster: String): [Message]
  }

  input SigninUserInput {
    email: String!
    password: String!
    username: String
  }

  type Mutation {
    signup(user: SigninUserInput!): User
    login(user: SigninUserInput!): User
    createPerson(name: String): Personne @cypher(statement: "CREATE (p:Personne { name: $name }) RETURN p")
    ActionPersonne(p1: String, p2: String, relation: String!): Personne
    AddMessage(actors: String!, text: String!, to: String!): Message
  }

`;

export const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

