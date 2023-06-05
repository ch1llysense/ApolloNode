import Entity from "../../entity";
import { v4 as uuidv4 } from "uuid";
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
