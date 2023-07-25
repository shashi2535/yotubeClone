/* eslint-disable no-useless-escape */
const subScribeSchema = `#graphql
directive @auth on FIELD_DEFINITION
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
 type subscribeRemoveRes{
     status_code:Int
    message:String
    data: subscribe_id
 }
 input removeSubscriptionReq{
   subscribe_id:String
 }
type subscriptionCount{
   count:Int
}

 type subscribeGetListResponse{
     status_code:Int
    message:String
    data: subscriptionCount
 }

type Mutation{
createSubscribe(input:subscibeReq):subscribeRes @auth 
removeSubscribe(input:removeSubscriptionReq):subscribeRemoveRes @auth 
  }

# type Query{
# getSubscribeCount(input:removeSubscriptionReq):subscribeGetListResponse 
# }  
`;
export { subScribeSchema };
