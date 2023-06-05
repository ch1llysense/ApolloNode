import fs from "fs";
import Book from "../domain/entities/book";
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
export default BookRepository;
