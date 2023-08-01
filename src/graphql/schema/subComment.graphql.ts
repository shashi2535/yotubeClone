const subCommentSchema = `#graphql
directive @auth on FIELD_DEFINITION
directive @updateCommentValid on FIELD_DEFINITION
directive @updateSubCommentValid on FIELD_DEFINITION
directive @deleteSubCommentValid on FIELD_DEFINITION
directive @deleteCommentValid on FIELD_DEFINITION
input subCommentCreateReq{
comment_id:String
comment:String
}

input subCommentUpdateReq{
sub_comment_id:String
comment:String
}

input subCommentDeleteReq{
  sub_comment_id:String
}

type sub_comment_response{
  comment_uuid:String
  sub_comment_uuid:String
  video_uuid:String
  comment:String
  created_at:String
  updated_at:String
}

type createSubCommentResponse{
  status_code:Int
  message:String
  data:sub_comment_response
}

type subCommentUpdateRes{
    status_code:Int
    message:String
    data:sub_comment_response
}

type subCommentDeleteRes{
    status_code:Int
    message:String
}
type SubCommentForUser{
first_name:String
last_name:String
}
type SubCommentForComment{
comment_uuid:String
}

type subCommentRes{
sub_comment_uuid:String
sub_comment:String
Comment:SubCommentForComment
User_Sub_Comment:SubCommentForUser
}

type subCommentByCommentIdRes{
    status_code:Int
    message:String
    data:[subCommentRes]
}



type Mutation{
createSubComment(input:subCommentCreateReq):createSubCommentResponse @auth @updateCommentValid
updateSubComment(input:subCommentUpdateReq):subCommentUpdateRes @auth @updateSubCommentValid
removeSubComment(input:subCommentDeleteReq):subCommentDeleteRes @auth @deleteSubCommentValid
}
type Query{
getSubCommentByCommentId(input:deleteCommentReq):subCommentByCommentIdRes @auth @deleteCommentValid
}
`;
export { subCommentSchema };
