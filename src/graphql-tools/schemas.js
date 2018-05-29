// Simple Movie schema
export const typeDefs = `

type Personne {
  name: String
  visite: [Personne] @relation(name: "visite", direction: "OUT")
  blacklist: [Personne] @relation(name: "blacklist", direction: "OUT")
  favorite: [Personne] @relation(name: "favorite", direction: "OUT")
  visiteIn: [Personne] @relation(name: "visite", direction: "IN")
  blacklistIn: [Personne] @relation(name: "blacklist", direction: "IN")
  favoriteIn: [Personne] @relation(name: "favorite", direction: "IN")
}

type Message {
  poster: String
  text: String
}

type Query {
  Personne(name: String): [Personne]
  Message(poster: String!): [Message]
}

type Mutation {
  createPerson(name: String): Personne @cypher(statement: "CREATE (p:Personne { name: $name }) RETURN p")
  ActionPersonne(p1: String, p2: String, dynamique: String): Personne
  AddMessage(poster: String!, text: String!): Message
}

`;

