// import Book from "./book";
// import BooksDataSource from "./database";

// export default class BookRepository {
//   dataSource: any;

//   constructor() {
//     this.dataSource = BooksDataSource;
//   }

//   async getBookById(id: string): Promise<Book> {
//     const book = this.dataSource.find((book: any) => book.id === id);
//     return new Book(book);
//   }

//   async getBooks(): Promise<Book[]> {
//     return this.dataSource.map((book: any) => new Book(book));
//   }

//   async createBook(book: Book): Promise<Book> {
//     this.dataSource.push(book);
//     return book;
//   }

//   async updateBook(book: Book): Promise<Book> {
//     const bookIndex = this.dataSource.findIndex(
//       (book: any) => book.id === book.id
//     );
//     this.dataSource[bookIndex] = book;
//     return book;
//   }

//   async deleteBook(id: string): Promise<Book> {
//     const bookIndex = this.dataSource.findIndex((book: any) => book.id === id);
//     const book = this.dataSource[bookIndex];
//     this.dataSource.splice(bookIndex, 1);
//     return book;
//   }
// }
