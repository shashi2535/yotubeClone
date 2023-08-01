import { ICommentAttributes } from './comment';

interface ISubCommentAttributes {
  id: number;
  comment_id: number;
  user_id: number;
  sub_comment_uuid: string;
  sub_comment: string;
  created_at?: Date;
  updated_at?: Date;
  Comment?: ICommentAttributes;
}

interface IUpdateSubComment {
  input: {
    sub_comment_id: string;
    comment: string;
  };
}

interface IDeleteSubComment {
  input: {
    sub_comment_id: string;
  };
}

export { ISubCommentAttributes, IUpdateSubComment, IDeleteSubComment };
