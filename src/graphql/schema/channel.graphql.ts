/* eslint-disable no-useless-escape */
const channelSchema = `#graphql
directive @valid on FIELD_DEFINITION
directive @auth on FIELD_DEFINITION
type channel{
  handle:String
  chanel_uuid:String
  channel_name:String
  UserId:ID
}
input createChannelRequest{
  channel_name:String!  @constraint(minLength:5)
  handle:String!  @constraint(minLength:5, maxLength:25)
}
type chanelRes{
    chanel_uuid:String
    channel_name:String
    handle:String
    discription:String
    created_at:String
    updated_at:String
    User: User
}
type User{
  email:String
  phone:String
  user_uuid:ID
  first_name:String
  last_name:String
}
type createChannelResponse{
  message:String!
  status_code:Int!
  data:chanelRes
}
type getChannelResponse{
  message:String!
  status_code:Int
}
type Query{
  getChanelByUserId:getChannelResponse  @auth @valid
}
type Mutation{
createChannel(input:createChannelRequest):createChannelResponse
  }
`;
export { channelSchema };
