/* eslint-disable no-useless-escape */
const channelSchema = `#graphql
directive @auth on FIELD_DEFINITION
directive @avtarValid on FIELD_DEFINITION
directive @roleCheck on FIELD_DEFINITION
directive @verifyChannelValid on FIELD_DEFINITION

  scalar Upload
  type fileUploadResponse {
    message:String
    status_code:Int
    url:String
  }
type channel{
  handle:String
  chanel_uuid:String
  channel_name:String
  UserId:ID
}
type User{
  email:String
  phone:String
  user_uuid:ID
  first_name:String
  last_name:String
}
type chanelRes{
    chanel_uuid:String
    channel_name:String
    handle:String
    discription:String
    created_at:String
    updated_at:String
    url:String
}
type GetChannelRes{
     chanel_uuid:String
    channel_name:String
    handle:String
    discription:String
    created_at:String
    updated_at:String
    url:String
    subscriber_count:Int
}
type createChannelResponse{
  message:String
  status_code:Int
  data:chanelRes
}
type getCheannelResponse {
   message:String
  status_code:Int
  data: GetChannelRes
}
type Query{
  getChanelByUserId:getCheannelResponse  @auth
}
type verifiedChannelByAdminRes{
  message:String
  status_code:Int
}

type Mutation{
createChannel(channel_name:String!, handle:String!, profile_picture:Upload):createChannelResponse @auth @avtarValid
updateChannel(channel_name:String, handle:String, profile_picture:Upload):createChannelResponse @auth @avtarValid
deleteChannel:createChannelResponse @auth
verifiedChannelByAdmin(channel_id:String):verifiedChannelByAdminRes  @auth @roleCheck @verifyChannelValid
  }
type Subscription{
createEvent:Boolean
}

`;
export { channelSchema };
