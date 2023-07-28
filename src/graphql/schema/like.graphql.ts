/* eslint-disable no-useless-escape */
const likeSchema = `#graphql
directive @auth on FIELD_DEFINITION
directive @creaeLikeValid on FIELD_DEFINITION

input likeCreateReq{
video_id:String
type:String
}
type like_count{
  count:Int
}
type createLikeRes{
    status_code:String
    message:String
}

type createLikeResponse{
  status_code:Int
  message:String,
  data:like_count
}

type Mutation{
createLike(input:likeCreateReq):createLikeRes @auth @creaeLikeValid
}
`;
export { likeSchema };
