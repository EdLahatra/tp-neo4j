import { makeExecutableSchema } from 'graphql-tools';

import { neo4jgraphql } from '../neo4j-graphql-js/index';
import { typeDefs } from './schemas';

export const resolvers = {
  // root entry point to GraphQL service
  Query: {
    // fetch movies by title substring
    Personne(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    Message(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
  },
  Mutation: {
    createPerson(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true);
    },
    ActionPersonne(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true, true);
    },
    AddMessage(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo, true, true);
    },
  }
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
