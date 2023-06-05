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
class Entity {
    constructor(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
}
export default class Book extends Entity {
    constructor(book) {
        super(book.id);
        this._id = book.id;
        this._title = book.title;
        this._author = book.author;
        this._is_reserved = book.is_reserved;
    }
    get id() {
        return this._id;
    }
    get title() {
        return this._title;
    }
    get author() {
        return this._author;
    }
    get is_reserved() {
        return this._is_reserved;
    }
    reserve() {
        this._is_reserved = true;
    }
    releaseReservation() {
        this._is_reserved = false;
    }
    create(title, author) {
        const id = uuidv4();
        const book = new Book({
            id: id,
            title: title,
            author: author,
            is_reserved: false,
        });
        return book;
    }
    setTitle(title) {
        if (this._title === title) {
            throw new Error("You cannot set the same title as before");
        }
        // TODO: GUARD CLAUSE from Null or Undefined
        if (title === "" || title === null || title === undefined) {
            this._title = "Randomized title";
        }
        else {
            this._title = title;
        }
    }
}
class BookRepository {
    constructor() {
        const jsonData = fs.readFileSync(BookRepository.filePath, "utf8");
        this.dataSource = JSON.parse(jsonData);
    }
    async getBookById(id) {
        const book = this.dataSource.find((book) => book._id === id);
        // FIXME jak niżej
        return new Book({
            id: book._id,
            title: book._title,
            author: book._author,
            is_reserved: book._is_reserved,
        });
    }
    async getBooks() {
        return this.dataSource.map((book) => {
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
    async createBook(book) {
        await this.dataSource.push(book);
        this.save();
        return book;
    }
    async updateBook(book) {
        const bookIndex = await this.dataSource.findIndex((book) => book._id === book._id);
        this.dataSource[bookIndex] = book;
        this.save();
        return book;
    }
    async deleteBook(id) {
        const bookIndex = this.dataSource.findIndex((book) => book.id === id);
        const book = this.dataSource[bookIndex];
        this.dataSource.splice(bookIndex, 1);
        return book;
    }
    async save() {
        const jsonData = JSON.stringify(this.dataSource);
        fs.writeFileSync(BookRepository.filePath, jsonData, "utf8");
    }
}
BookRepository.filePath = "books.json";
var bookRepo = new BookRepository();
class CreateBookCommand {
    constructor({ title, author }) {
        this.id = uuidv4();
        this.title = title;
        this.author = author;
        this.is_reserved = false;
    }
}
class CreateBookCommandHandler {
    constructor(bookRepo) {
        this.bookRepo = bookRepo;
    }
    async handle(command) {
        console.log("command", command);
        const book = new Book({
            id: command.id,
            title: command.title,
            author: command.author,
            is_reserved: command.is_reserved,
        });
        console.log("book HEERE", book);
        await this.bookRepo.createBook(book);
    }
}
//
class UpdateBookTitleCommandHandler {
    constructor(bookRepo) {
        this.bookRepo = bookRepo;
    }
    async handle(command) {
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
class UpdateBookTitleCommand {
    constructor({ id, title }) {
        this.id = id;
        this.title = title;
    }
}
class ReserveBookCommand {
    constructor({ id }) {
        this.id = id;
    }
}
class ReserveBookCommandHandler {
    constructor(bookRepo) {
        this.bookRepo = bookRepo;
    }
    async handle(command) {
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
