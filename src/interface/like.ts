interface ILikeAttributes {
  id: number;
  video_id: number;
  user_id: number;
  reaction?: string | null;
  video_uuid?: string | null;
  like_uuid?: string | undefined;
  created_at?: Date;
  updated_at?: Date;
}
interface IlikeCreateReq {
  input: {
    video_id: string;
    type: string;
  };
}

export { ILikeAttributes, IlikeCreateReq };
