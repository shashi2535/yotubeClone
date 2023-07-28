/* eslint-disable no-useless-escape */
const videoSchema = `#graphql
directive @auth on FIELD_DEFINITION
directive @videoValid on FIELD_DEFINITION
directive @videoDeleteValid on FIELD_DEFINITION

scalar Upload
input createVideoInput{
title:String
description:String
}
type videoRes{
  video_uuid:String
  url:String
  created_at:String
  updated_at:String
    type:String
  title:String
  description:String
}
type createVideoResponse{
  status_code:Int
  message:String
  data:videoRes
}
type deleteVideoResponse{
  status_code:Int
  message:String
}


type Mutation{
createVideo(input:createVideoInput,video_url:Upload!):createVideoResponse @auth @videoValid
deleteVideo(video_id:String!):deleteVideoResponse @auth @videoDeleteValid

}
`;
export { videoSchema };
