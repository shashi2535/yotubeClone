const userSchema = `#graphql
  type Book {
    title: String
    author: String
  }
input signupInput {
  name:String
 email:String
}
type User{
 id:ID
 name:String
 email:String
}
type Query {
    books: String
    userData:[User]
  }
type Mutation{
  createUser( name:String, email:String):User
}
`;
export { userSchema };
