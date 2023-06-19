/* eslint-disable no-useless-escape */
const channelSchema = `#graphql
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
type createChannelResponse{
  message:String!
  status_code:Int!
  data:channel
}
type Query{
  getChanel:String
}
type Mutation{
createChannel(input:createChannelRequest):createChannelResponse
  }
`;
export { channelSchema };
