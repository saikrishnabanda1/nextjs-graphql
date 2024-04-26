import { ApolloServer, gql } from "apollo-server-micro";
import Cors from "micro-cors";

export const config = {
  api: {
    bodyParser: false,
  },
};

let books = [
  {
    title: "Sai Krishna",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: () => books,
    // products: () => products,
  },
};

const cors = Cors();
// instance of ApolloServer
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ res }) => {},
  introspection: true,
  playground: true,
});

const serverStart = apolloServer.start();

export default cors(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await serverStart;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
});
