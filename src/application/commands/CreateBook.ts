import Book from "../../domain/entities/book";
import BookRepository from "../../infrastructure/repository";
import { ICommand, ICommandHandler } from "./interfaces";

import { v4 as uuidv4 } from "uuid";

export class CreateBookCommand implements ICommand {
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

export class CreateBookCommandHandler implements ICommandHandler {
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

export default { CreateBookCommand, CreateBookCommandHandler };
