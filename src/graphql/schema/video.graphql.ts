/* eslint-disable no-useless-escape */
const videoSchema = `#graphql
directive @auth on FIELD_DEFINITION
directive @videoValid on FIELD_DEFINITION
directive @videoDeleteValid on FIELD_DEFINITION
directive @videoUpdateValid on FIELD_DEFINITION

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
input updateVideoInput{
title:String
description:String
video_id:String
}
type video_view{
  video_view:Int
}

type VideoViewResponse{
  status_code:Int
  message:String,
  data:video_view
}

type Mutation{
createVideo(input:createVideoInput,video_url:Upload!):createVideoResponse @auth @videoValid
deleteVideo(video_id:String!):deleteVideoResponse @auth @videoDeleteValid
updateVideo(input:updateVideoInput):createVideoResponse @auth @videoUpdateValid
update_video_view(video_id:String!):VideoViewResponse @auth @videoDeleteValid
}
`;
export { videoSchema };
