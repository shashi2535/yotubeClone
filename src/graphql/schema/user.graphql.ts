const userSchema = `#graphql
  type Book {
    title: String
    author: String
  }
type User{
 id:ID
 name:String
 email:String
}
type Response{
  message:String
  data:User
}
type Query {
    books: String
    userData:[User]
  }
  type Mutation{
    createUser(name:String, email:String):Response!
  }
`;
export { userSchema };
