import { makeExecutableSchema } from 'graphql-tools';
import {neo4jgraphql} from '../neo4j-graphql-js/index';
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import {v1 as neo4j} from 'neo4j-driver';



// Simple Movie schema
const typeDefs = `

type Personne {
  name: String
  visite: [Personne] @relation(name: "visite", direction: "OUT")
  blacklist: [Personne] @relation(name: "blacklist", direction: "OUT")
  favorite: [Personne] @relation(name: "favorite", direction: "OUT")
  visiteIn: [Personne] @relation(name: "visite", direction: "IN")
  blacklistIn: [Personne] @relation(name: "blacklist", direction: "IN")
  favoriteIn: [Personne] @relation(name: "favorite", direction: "IN")
}

type Query {
  Personne(name: String): [Personne]
}

type Mutation {
  createPerson(name: String): Personne @cypher(statement: "CREATE (p:Personne { name: $name }) RETURN p")
  ActionPersonne(p1: String, p2: String, dynamique: String): Personne
}

`;

const resolvers = {
  // root entry point to GraphQL service
  Query: {
    // fetch movies by title substring
    Personne(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    }
  },
  Mutation: {
    createPerson(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    ActionPersonne(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true, true);
    },
  }
};


const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

let driver;


function context(headers, secrets) {

  if (!driver) {
    driver = neo4j.driver(secrets.NEO4J_URI || "bolt://localhost:7687", neo4j.auth.basic(secrets.NEO4J_USER || "neo4j", secrets.NEO4J_PASSWORD || "lanjara0311"))
  }
  return {driver,
          headers};
}

const rootValue = {};


const PORT = 3000;
const server = express();

server.use('/graphql', bodyParser.json(), graphqlExpress(request => ({
  schema,
  rootValue,
  context: context(request.headers, process.env),
})));

server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: `{
  
}`,
}));

server.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
});