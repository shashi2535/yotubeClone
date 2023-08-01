import { IVideoAttributes } from './video';

interface ICommentAttributes {
  id: number;
  comment_uuid: string;
  video_id?: number | null;
  user_id?: number | null;
  video_uuid?: string | null;
  text?: string | null;
  created_at?: Date;
  updated_at?: Date;
  Comment_Video?: IVideoAttributes;
}

interface IcommentCreateAttributes {
  input: {
    video_id: string;
    comment?: string;
  };
}
interface IcommentDeleteAttributes {
  input: {
    comment_id: string;
  };
}
interface IcommentUpdateAttributes {
  input: {
    comment_id: string;
    comment: string;
  };
}

export { ICommentAttributes, IcommentCreateAttributes, IcommentDeleteAttributes, IcommentUpdateAttributes };
