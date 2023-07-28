/* eslint-disable no-useless-escape */
const subScribeSchema = `#graphql
directive @auth on FIELD_DEFINITION
directive @roleCheck on FIELD_DEFINITION
 input subscibeReq{
    channel_id:String
 }

 type subscribe{
    subscibe_id:String
    channel_id:String
    user_id:String
 }

 type subscribeRes{
    status_code:Int
    message:String
    data:subscribe
 }
  type subscribe_id{
    subscibe_id:String
 }
 type Avtar{
image_uuid:String
avtar_url:String
 }
 type Channel{
chanel_uuid:String
channel_name:String
handle:String
is_verified:Boolean
Avtar:Avtar
 }
 type subscribeRemoveRes{
     status_code:Int
    message:String
    data: subscribe_id
 }
 input removeSubscriptionReq{
   subscribe_id:String
 }
type subscriptionCount{
   subscribed_channel_id:Int
   subscribed_channel_id_count:Int
   Channel: Channel
}

 type subscribeGetListResponse{
     status_code:Int
    message:String
    data: [subscriptionCount]
 }

type Mutation{
createSubscribe(input:subscibeReq):subscribeRes @auth 
removeSubscribe(input:removeSubscriptionReq):subscribeRemoveRes @auth 
  }

type Query{
getSubscribedChannelByAdmin:subscribeGetListResponse @auth @roleCheck
}  
`;
export { subScribeSchema };
