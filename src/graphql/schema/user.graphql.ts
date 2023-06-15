/* eslint-disable no-useless-escape */
const userSchema = `#graphql
  type Book {
    title: String
    author: String
  }
type User{
 user_uuid:ID
 name:String
 email:String
 phone:String
}
type signupResponse{
  status_code:Int
  message:String
  data:User
}
input verifyEmailByTokenRequest{
  email: String  @constraint(format: "email")
  code:String  @constraint(minLength:8)
}

input resendOtpRequest{
  user_uuid:String!  @constraint(minLength:36) 
}

input resendCodeRequest{
  user_uuid:String!  @constraint(minLength:36) 
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
input login{
   email:String!  @constraint(format: "email")
  password:String!  @constraint(minLength:5, maxLength:25)
}
type loginResponse{
  token: String!
  message:String!
  status_code:Int!
}
type Mutation{
    createUser(input:signup):signupResponse!
    verifyOtp(input:verifyOtp):verifyOtpResponse!
    resendOtp(input:resendOtpRequest): verifyOtpResponse!
    verifyEmailByToken(input:verifyEmailByTokenRequest):verifyOtpResponse!
    resendTokenOnEmail(input:resendCodeRequest):verifyOtpResponse!
    login(input: login):loginResponse!
  }
`;
export { userSchema };
