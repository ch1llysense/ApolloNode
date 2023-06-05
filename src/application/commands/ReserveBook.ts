import BookRepository from "../../infrastructure/repository";
import { ICommand, ICommandHandler } from "./interfaces";

export class ReserveBookCommand implements ICommand {
  id: string;

  constructor({ id }: { id: string }) {
    this.id = id;
  }
}

export class ReserveBookCommandHandler implements ICommandHandler {
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

export default { ReserveBookCommand, ReserveBookCommandHandler };
