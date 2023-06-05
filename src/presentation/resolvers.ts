import {
  CreateBookCommandHandler,
  CreateBookCommand,
} from "../application/commands/CreateBook";
import {
  ReserveBookCommandHandler,
  ReserveBookCommand,
} from "../application/commands/ReserveBook";
import {
  UpdateBookTitleCommandHandler,
  UpdateBookTitleCommand,
} from "../application/commands/UpdateBookTitle";
import BookRepository from "../infrastructure/repository";

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

export default resolvers;
