const userSchema = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: String
  }
`

export { userSchema }
