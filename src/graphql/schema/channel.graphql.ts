/* eslint-disable no-useless-escape */
const channelSchema = `#graphql
input createChannelRequest{
   channel_name:String!  @constraint(minLength:5)
  handle:String!  @constraint(minLength:5, maxLength:25)
}
type createChannelResponse{
  message:String!
  status_code:Int!
}
type Mutation{
createChannel(input:createChannelRequest ):createChannelResponse
  }
`;
export { channelSchema };
