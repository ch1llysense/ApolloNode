import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import typeDefs from "./presentation/type-defs";
import resolvers from "./presentation/resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
});

console.log(`🚀  Server ready at: ${url}`);
