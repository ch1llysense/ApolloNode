// import Entity from "./entity";

// interface BookProps {
//   id: string;
//   title?: string;
//   author?: string;
// }

// export default class Book extends Entity<BookProps> {
//   protected _id: string;
//   private _title: string;
//   private _author: string;

//   constructor(book: BookProps) {
//     super(book.id);
//     this._id = book.id;
//     this._title = book.title;
//     this._author = book.author;
//   }

//   get id(): string {
//     return this._id;
//   }

//   get title(): string {
//     if (this._title === "The Awakening1")
//       throw new Error("Title invalid: The Awakening");
//     return this._title;
//   }

//   get author(): string {
//     return this._author;
//   }

//   setTitle(title: string) {
//     if (this._title === title) {
//       new Error("The title is the same");
//     }

//     if (title === "" || title === null || title === undefined) {
//       this._title = "Randomized title";
//     }

//     this._title = title;
//   }
// }
