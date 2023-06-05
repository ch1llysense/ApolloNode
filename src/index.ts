import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { v4 as uuidv4 } from "uuid";

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

abstract class Entity<T> {
  protected _id: string;

  constructor(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }
}

interface BookProps {
  id?: string;
  title?: string;
  author?: string;
  is_reserved?: boolean;
}

export default class Book extends Entity<BookProps> {
  protected _id: string;
  private _title: string;
  private _author: string;
  private _is_reserved: boolean;

  constructor(book: BookProps) {
    super(book.id);
    this._id = book.id;
    this._title = book.title;
    this._author = book.author;
    this._is_reserved = book.is_reserved;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }
  get author(): string {
    return this._author;
  }

  get is_reserved(): boolean {
    return this._is_reserved;
  }

  reserve(): void {
    this._is_reserved = true;
  }

  releaseReservation(): void {
    this._is_reserved = false;
  }

  create(title: string, author: string) {
    const id = uuidv4();
    const book = new Book({
      id: id,
      title: title,
      author: author,
      is_reserved: false,
    });
    return book;
  }

  setTitle(title: string) {
    if (this._title === title) {
      throw new Error("You cannot set the same title as before");
    }

    // TODO: GUARD CLAUSE from Null or Undefined
    if (title === "" || title === null || title === undefined) {
      this._title = "Randomized title";
    } else {
      this._title = title;
    }
  }
}

type BookDAO = {
  _id: string;
  _title: string;
  _author: string;
  _is_reserved: boolean;
};

class BookRepository {
  static filePath = "books.json";
  dataSource: any;

  constructor() {
    const jsonData = fs.readFileSync(BookRepository.filePath, "utf8");

    this.dataSource = JSON.parse(jsonData);
  }

  async getBookById(id: string): Promise<Book> {
    const book = this.dataSource.find((book: BookDAO) => book._id === id);
    // FIXME jak niżej
    return new Book({
      id: book._id,
      title: book._title,
      author: book._author,
      is_reserved: book._is_reserved,
    });
  }

  async getBooks(): Promise<Book[]> {
    return this.dataSource.map((book: BookDAO) => {
      // FIXME:
      // console.log("persistance book", book);
      // console.log(
      //   "in-memory object book",
      //   new Book({ id: book._id, title: book._title, author: book._author })
      // );
      return new Book({
        id: book._id,
        title: book._title,
        author: book._author,
        is_reserved: book._is_reserved,
      });
    });
  }

  async createBook(book: Book): Promise<Book> {
    await this.dataSource.push(book);
    this.save();

    return book;
  }

  async updateBook(book: Book): Promise<Book> {
    const bookIndex = await this.dataSource.findIndex(
      (book: BookDAO) => book._id === book._id
    );

    this.dataSource[bookIndex] = book;
    this.save();

    return book;
  }

  async deleteBook(id: string): Promise<Book> {
    const bookIndex = this.dataSource.findIndex((book: any) => book.id === id);
    const book = this.dataSource[bookIndex];
    this.dataSource.splice(bookIndex, 1);
    return book;
  }

  async save() {
    const jsonData = JSON.stringify(this.dataSource);
    fs.writeFileSync(BookRepository.filePath, jsonData, "utf8");
  }
}

var bookRepo = new BookRepository();

interface ICommandHandler {}
interface ICommand {}

class CreateBookCommand implements ICommand {
  id: string;
  title: string;
  author: string;
  is_reserved: boolean;

  constructor({ title, author }: { title: string; author: string }) {
    this.id = uuidv4();
    this.title = title;
    this.author = author;
    this.is_reserved = false;
  }
}

class CreateBookCommandHandler implements ICommandHandler {
  bookRepo: BookRepository;

  constructor(bookRepo: BookRepository) {
    this.bookRepo = bookRepo;
  }

  async handle(command: CreateBookCommand) {
    console.log("command", command);
    const book = new Book({
      id: command.id,
      title: command.title,
      author: command.author,
      is_reserved: command.is_reserved,
    });
    await this.bookRepo.createBook(book);
  }
}

//

class UpdateBookTitleCommandHandler implements ICommandHandler {
  bookRepo: BookRepository;

  constructor(bookRepo: BookRepository) {
    this.bookRepo = bookRepo;
  }

  async handle(command: UpdateBookTitleCommand) {
    // Retrieve the book from the repository based on the ID
    console.log("command", command);
    const book = await this.bookRepo.getBookById(command.id);
    console.log("command-id", command.id);
    console.log("book", typeof book);

    // Update the title of the book using the command
    book.setTitle(command.title);

    // Save the updated book back to the repository
    await this.bookRepo.updateBook(book);
  }
}

class UpdateBookTitleCommand implements ICommand {
  id: string;
  title: string;

  constructor({ id, title }: { id: string; title: string }) {
    this.id = id;
    this.title = title;
  }
}

class ReserveBookCommand implements ICommand {
  id: string;

  constructor({ id }: { id: string }) {
    this.id = id;
  }
}

class ReserveBookCommandHandler implements ICommandHandler {
  bookRepo: BookRepository;

  constructor(bookRepo: BookRepository) {
    this.bookRepo = bookRepo;
  }

  async handle(command: ReserveBookCommand) {
    // Retrieve the book from the repository based on the ID
    const book = await this.bookRepo.getBookById(command.id);

    // Reserve the book using the command
    book.reserve();

    // Save the updated book back to the repository
    await this.bookRepo.updateBook(book);
  }
}

import fs from "fs";

console.log("Updated books collection:", await bookRepo.getBooks());
