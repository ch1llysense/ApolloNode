const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String
    author: String
    is_reserved: Boolean

  }

input CreateBookInput {
  title: String
  author: String
}

  type Query {
    books: [Book]
    book(id: String!): Book
  }

  type Mutation {
    createBook(data: CreateBookInput): Book
    updateBookTitle(id: String!, title: String!): Book
    reserveBook(id: String!): Book
  }
`;

export default typeDefs;
