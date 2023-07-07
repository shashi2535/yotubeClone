/* eslint-disable no-useless-escape */

const userSchema = `#graphql
directive @loginValid on FIELD_DEFINITION
directive @signupValid on FIELD_DEFINITION
directive @verifyEmailValid on FIELD_DEFINITION
directive @resendCodeOnEmailValid on FIELD_DEFINITION
directive @verifyOtpValid on FIELD_DEFINITION
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
  email: String 
  code:String 
}

input resendOtpRequest{
  user_uuid:String 
}

input resendCodeRequest{
  user_uuid:String
}

type Query {
    books: String
}
input verifyOtp{
  phone:String 
  otp:String
}

type verifyOtpResponse{
  status_code:Int
  message:String
}

input signup {
  first_name:String 
  last_name:String  
  email:String  
  password:String 
  phone: String
}
input login{
   email:String!  
  password:String! 
}
type loginResponse{
  token: String!
  message:String!
  status_code:Int!
}
type Mutation{
    createUser(input:signup):signupResponse!  @signupValid
    verifyOtp(input:verifyOtp):verifyOtpResponse! @verifyOtpValid
    resendOtp(input:resendOtpRequest): verifyOtpResponse! @resendCodeOnEmailValid
    resendTokenOnEmail(input:resendCodeRequest):verifyOtpResponse! @resendCodeOnEmailValid
    verifyEmailByToken(input:verifyEmailByTokenRequest):verifyOtpResponse! @verifyEmailValid
    login(input: login):loginResponse! @loginValid
  }
`;
export { userSchema };
