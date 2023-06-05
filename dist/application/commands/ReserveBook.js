export class ReserveBookCommand {
    constructor({ id }) {
        this.id = id;
    }
}
export class ReserveBookCommandHandler {
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
export default { ReserveBookCommand, ReserveBookCommandHandler };
