import Entity from "../../entity";

import { v4 as uuidv4 } from "uuid";

interface BookProps {
  id?: string;
  title?: string;
  author?: string;
  is_reserved?: boolean;
}

export default class Book extends Entity<BookProps> {
  protected _id: string;
  private _title: string;
  private _author: string;
  private _is_reserved: boolean;

  constructor(book: BookProps) {
    super(book.id);
    this._id = book.id;
    this._title = book.title;
    this._author = book.author;
    this._is_reserved = book.is_reserved;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }
  get author(): string {
    return this._author;
  }

  get is_reserved(): boolean {
    return this._is_reserved;
  }

  reserve(): void {
    this._is_reserved = true;
  }

  releaseReservation(): void {
    this._is_reserved = false;
  }

  create(title: string, author: string) {
    const id = uuidv4();
    const book = new Book({
      id: id,
      title: title,
      author: author,
      is_reserved: false,
    });
    return book;
  }

  setTitle(title: string) {
    if (this._title === title) {
      throw new Error("You cannot set the same title as before");
    }

    // TODO: GUARD CLAUSE from Null or Undefined
    if (title === "" || title === null || title === undefined) {
      this._title = "Randomized title";
    } else {
      this._title = title;
    }
  }
}
