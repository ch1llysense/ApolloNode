import BookRepository from "../../infrastructure/repository";
import { ICommand, ICommandHandler } from "./interfaces";

export class UpdateBookTitleCommandHandler implements ICommandHandler {
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

export class UpdateBookTitleCommand implements ICommand {
  id: string;
  title: string;

  constructor({ id, title }: { id: string; title: string }) {
    this.id = id;
    this.title = title;
  }
}

export default { UpdateBookTitleCommand, UpdateBookTitleCommandHandler };
