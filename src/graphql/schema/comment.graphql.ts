/* eslint-disable no-useless-escape */
const commentSchema = `#graphql
directive @auth on FIELD_DEFINITION
directive @createCommentValid on FIELD_DEFINITION
directive @deleteCommentValid on FIELD_DEFINITION
directive @updateCommentValid on FIELD_DEFINITION

input createCommentReq{
  video_id:String
  comment:String
}
input deleteCommentReq{
  comment_id:String
}
input updateCommentReq{
  comment:String
  comment_id:String
}
type comentRes{
  comment_uuid:String
  video_uuid:String
  comment:String
  created_at:String
  updated_at:String
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
type Mutation{
createComment(input:createCommentReq):createCommentResponse @auth  @createCommentValid
deleteComment(input:deleteCommentReq):deleteCommentResponse @auth  @deleteCommentValid
updateComment(input:updateCommentReq):createCommentResponse @auth  @updateCommentValid
}
`;
export { commentSchema };
