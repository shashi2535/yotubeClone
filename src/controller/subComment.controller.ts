import { Op } from 'sequelize';
import { logger } from '../config';
import { HttpStatus } from '../constant';
import {
  IcommentUpdateAttributes,
  Icontext,
  ISubCommentAttributes,
  IUpdateSubComment,
  IDeleteSubComment,
  IcommentDeleteAttributes,
} from '../interface';
import { Comment, User, Video } from '../models';
import { Sub_Comment } from '../models/sub_comment';
import { generateUUID } from '../utils';

const subCommentResolverController = {
  createSubComment: async (parent: unknown, input: IcommentUpdateAttributes, context: Icontext) => {
    logger.info('createSubCommentController');
    const { comment, comment_id } = input.input;
    const { userId } = context;
    const commentData = await Comment.findOne({ where: { comment_uuid: comment_id }, raw: true, nest: true });
    if (!commentData) {
      return {
        message: 'Comment Not Found.',
        status_code: HttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    const createSubComment = await Sub_Comment.create({
      sub_comment_uuid: generateUUID(),
      comment_id: commentData.id,
      user_id: userId,
      sub_comment: comment,
    });
    return {
      message: 'Sub Comment Created Successfully.',
      status_code: HttpStatus.OK,
      data: {
        comment_uuid: comment_id,
        sub_comment_uuid: createSubComment.sub_comment_uuid,
        comment: comment,
        created_at: createSubComment.created_at,
        updated_at: createSubComment.updated_at,
        video_uuid: commentData.video_uuid,
      },
    };
  },
  updateSubComment: async (parent: unknown, input: IUpdateSubComment, context: Icontext) => {
    const { comment, sub_comment_id } = input.input;
    const { userId } = context;
    const subCommentData = await Sub_Comment.findOne({
      where: {
        [Op.and]: [
          {
            user_id: userId,
          },
          {
            sub_comment_uuid: sub_comment_id,
          },
        ],
      },
      raw: true,
      nest: true,
    });
    if (!subCommentData) {
      return {
        message: 'Sub Comment Not Found.',
        status_code: HttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    await Sub_Comment.update(
      {
        sub_comment: comment,
      },
      { where: { sub_comment_uuid: sub_comment_id } }
    );
    const subCommentUpdatedData = (await Sub_Comment.findOne({
      where: { sub_comment_uuid: sub_comment_id },
      raw: true,
      nest: true,
      include: [
        {
          model: Comment,
          as: 'Comment',
          attributes: ['comment_uuid'],
          include: [
            {
              model: Video,
              as: 'Comment_Video',
              attributes: ['video_uuid'],
            },
          ],
        },
      ],
    })) as ISubCommentAttributes;
    return {
      status_code: HttpStatus.OK,
      message: 'Sub Comment Update Successfully.',
      data: {
        comment_uuid: subCommentUpdatedData?.Comment?.comment_uuid,
        sub_comment_uuid: subCommentUpdatedData?.sub_comment_uuid,
        comment: subCommentUpdatedData?.sub_comment,
        created_at: subCommentUpdatedData?.created_at,
        updated_at: subCommentUpdatedData?.updated_at,
        video_uuid: subCommentUpdatedData?.Comment?.Comment_Video?.video_uuid,
      },
    };
  },
  removeSubComment: async (parent: unknown, input: IDeleteSubComment, context: Icontext) => {
    logger.info('removeSubComment controller');
    const { userId } = context;
    const { sub_comment_id } = input.input;
    const subCommentData = await Sub_Comment.findOne({
      where: {
        [Op.and]: [
          {
            user_id: userId,
          },
          {
            sub_comment_uuid: sub_comment_id,
          },
        ],
      },
      raw: true,
      nest: true,
    });
    if (!subCommentData) {
      return {
        message: 'sub_comment Not Found.',
        status_code: HttpStatus.BAD_REQUEST,
      };
    }
    await Sub_Comment.destroy({
      where: {
        sub_comment_uuid: sub_comment_id,
      },
    });
    return {
      message: 'Comment Deleted Successfully.',
      status_code: HttpStatus.OK,
    };
  },
};
const subCommentQueryController = {
  getSubCommentByCommentId: async (parent: unknown, input: IcommentDeleteAttributes, context: Icontext) => {
    const { comment_id } = input.input;
    const commentData = await Comment.findOne({
      where: {
        comment_uuid: comment_id,
      },
      raw: true,
      nest: true,
    });
    if (!commentData) {
      return {
        message: 'Comment Not Found.',
        status_code: HttpStatus.BAD_REQUEST,
      };
    }
    const subComentData = await Sub_Comment.findAll({
      where: {
        comment_id: commentData.id,
      },
      include: [
        {
          model: Comment,
          as: 'Comment',
          attributes: ['comment_uuid'],
        },
        { model: User, as: 'User_Sub_Comment', attributes: ['first_name', 'last_name'] },
      ],
      attributes: ['sub_comment_uuid', 'sub_comment'],
      raw: true,
      nest: true,
    });
    return {
      message: 'Get Sub Comment List Successfully.',
      status_code: HttpStatus.OK,
      data: subComentData,
    };
  },
};

export { subCommentResolverController, subCommentQueryController };
