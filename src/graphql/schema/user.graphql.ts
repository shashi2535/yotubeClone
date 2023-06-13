/* eslint-disable no-useless-escape */
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
type signupResponse{
  status_code:Int
  message:String
  data:User
}
type Query {
    books: String
    userData:[User]
}
input verifyOtp{
  phone:String!  @constraint(minLength:10,pattern: "^([7-9]{1})([0-9]{9})$")   
  otp:String!    @constraint(minLength:1, maxLength:6)
}
type verifyOtpResponse{
  status_code:Int
  message:String
}

input signup {
  first_name:String! @constraint( minLength:5, maxLength: 25)
  last_name:String!  @constraint( minLength:5, maxLength: 25)
  email:String!  @constraint(format: "email")
  password:String!  @constraint(minLength:5, maxLength:25)
  phone: String!  @constraint(minLength:10,pattern: "^([7-9]{1})([0-9]{9})$")
}
  type Mutation{
    createUser(input:signup):signupResponse!
    verifyOtp(input:verifyOtp):verifyOtpResponse!
  }
`;
export { userSchema };
//
