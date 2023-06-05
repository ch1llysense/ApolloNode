import Book from "../../domain/entities/book";
import { v4 as uuidv4 } from "uuid";
export class CreateBookCommand {
    constructor({ title, author }) {
        this.id = uuidv4();
        this.title = title;
        this.author = author;
        this.is_reserved = false;
    }
}
export class CreateBookCommandHandler {
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
        await this.bookRepo.createBook(book);
    }
}
export default { CreateBookCommand, CreateBookCommandHandler };
