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

type Mutation{
createSubscribe(input:subscibeReq):subscribeRes @auth 
  }
`;
export { subScribeSchema };
