/* eslint-disable no-useless-escape */
const commentSchema = `#graphql
directive @auth on FIELD_DEFINITION
directive @createCommentValid on FIELD_DEFINITION
directive @deleteCommentValid on FIELD_DEFINITION
directive @updateCommentValid on FIELD_DEFINITION
directive @videoDeleteValid on FIELD_DEFINITION
directive @createLikeOnCommentValid on FIELD_DEFINITION

input createCommentReq{
  video_id:String
  comment:String
}
input deleteCommentReq{
  comment_id:String
}
input getCommentReq{
  video_id:String
}
input updateCommentReq{
  comment:String
  comment_id:String
}
input likeOnCommentReq{
  comment_id:String
  type:String
}
type comentRes{
  comment_uuid:String
  video_uuid:String
  comment:String
  created_at:String
  updated_at:String
}
type user_comment{
email:String
first_name:String
last_name:String
}

type getcomentResponse{
  comment_uuid:String
  video_uuid:String
  text:String
  created_at:String
  updated_at:String
  User_Comment:user_comment
  count:Int
}
type createCommentResponse{
  status_code:Int
  message:String
  data:comentRes
}
type deleteCommentResponse{
  status_code:Int
  message:String
}
type getCommentRes{
    status_code:Int
  message:String
  data:[getcomentResponse]
}

type Mutation{
createComment(input:createCommentReq):createCommentResponse @auth  @createCommentValid
deleteComment(input:deleteCommentReq):deleteCommentResponse @auth  @deleteCommentValid
updateComment(input:updateCommentReq):createCommentResponse @auth  @updateCommentValid
likeOnComment(input:likeOnCommentReq):createLikeResponse @auth @createLikeOnCommentValid
}

type Query{
  getCommentByVideoId(video_id:String!):getCommentRes  @auth  @videoDeleteValid
}
`;
export { commentSchema };
