import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { v4 as uuidv4 } from "uuid";
const books = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const typeDefs = `#graphql

  type Book {
    id: ID!
    title: String
    author: String
    reserved: Boolean

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
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4001 },
});

console.log(`🚀  Server ready at: ${url}`);

const BooksDataSource: { id: string; title?: string; author?: string }[] = [
  { id: "1", title: null, author: "Kate Chopin" },
  { id: "2", title: "City of Glass", author: "Paul Auster" },
];

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
}

export default class Book extends Entity<BookProps> {
  protected _id: string;
  private _title: string;
  private _author: string;

  constructor(book: BookProps) {
    super(book.id);
    this._id = book.id;
    this._title = book.title;
    this._author = book.author;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    if (this._title === null || this._title === undefined) {
      return "";
    }

    if (this._title === "The Awakening1") {
      throw new Error("Title invalid: The Awakening");
    }

    return this._title;
  }
  get author(): string {
    return this._author;
  }

  setTitle(title: string) {
    if (this._title === title) {
      new Error("The title is the same");
    }

    if (title === "" || title === null || title === undefined) {
      this._title = "Randomized title";
    }

    this._title = title;
  }
}

type BookDAO = {
  _id: string;
  _title: string;
  _author: string;
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

  constructor({ title, author }: { title: string; author: string }) {
    this.id = uuidv4();
    this.title = title;
    this.author = author;
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
    });
    console.log("book HEERE", book);
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
    console.log("book", book);

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

import fs from "fs";

console.log("Updated books collection:", await bookRepo.getBooks());
