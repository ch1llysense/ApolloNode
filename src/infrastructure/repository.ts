import fs from "fs";
import Book from "../domain/entities/book";

type BookDAO = {
  _id: string;
  _title: string;
  _author: string;
  _is_reserved: boolean;
};

export default class BookRepository {
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
