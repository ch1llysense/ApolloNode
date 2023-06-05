import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import BookRepository from "./infrastructure/repository";
import { CreateBookCommand, CreateBookCommandHandler, } from "./application/commands/CreateBook";
import { UpdateBookTitleCommand, UpdateBookTitleCommandHandler, } from "./application/commands/UpdateBookTitle";
import { ReserveBookCommand, ReserveBookCommandHandler, } from "./application/commands/ReserveBook";
const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String
    author: String
    is_reserved: Boolean

  }

input CreateBookInput {
  title: String
  author: String
}

  type Query {
    books: [Book]
    book(id: String!): Book
  }

  type Mutation {
    createBook(data: CreateBookInput): Book
    updateBookTitle(id: String!, title: String!): Book
    reserveBook(id: String!): Book
  }
`;
const bookRepo = new BookRepository();
const resolvers = {
    Query: {
        books: async () => bookRepo.getBooks(),
        book: async (_, { id }) => bookRepo.getBookById(id),
    },
    Mutation: {
        createBook: async (_, { data }) => {
            const { title, author } = data;
            const commandHandler = new CreateBookCommandHandler(bookRepo);
            const command = new CreateBookCommand({
                title: title,
                author: author,
            });
            await commandHandler.handle(command);
            return bookRepo.getBookById(command.id);
        },
        updateBookTitle: async (_, { id, title }) => {
            console.log(id, title);
            const commandHandler = new UpdateBookTitleCommandHandler(bookRepo);
            const command = new UpdateBookTitleCommand({
                id: id,
                title: title,
            });
            console.log(command);
            await commandHandler.handle(command);
            return bookRepo.getBookById(id);
        },
        reserveBook: async (_, { id }) => {
            const commandHandler = new ReserveBookCommandHandler(bookRepo);
            const command = new ReserveBookCommand({
                id: id,
            });
            await commandHandler.handle(command);
            return bookRepo.getBookById(id);
        },
    },
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
});
console.log(`🚀  Server ready at: ${url}`);
