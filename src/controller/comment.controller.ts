import { Op } from 'sequelize';
import { logger } from '../config';
import { HttpStatus } from '../constant';
import { IcommentCreateAttributes, IcommentDeleteAttributes, IcommentUpdateAttributes, Icontext } from '../interface';
import { Comment, Video } from '../models';
import { generateUUID } from '../utils';

const commentResolverController = {
  createComment: async (parent: unknown, input: IcommentCreateAttributes, context: Icontext) => {
    try {
      const { video_id, comment } = input.input;
      const { userId } = context;
      const videoData = await Video.findOne({ where: { video_uuid: video_id }, raw: true, nest: true });
      if (!videoData) {
        return {
          status_code: HttpStatus.OK,
          message: 'Video Not Found.',
        };
      }
      const commentData = await Comment.create({
        comment_uuid: generateUUID(),
        text: comment,
        user_id: userId,
        video_id: videoData.id,
        video_uuid: videoData.video_uuid,
      });
      // const countData = await Comment.findOne({ where: {}, nest: true, raw: true });
      return {
        status_code: HttpStatus.OK,
        message: 'Comment Added Successfully.',
        data: {
          comment_uuid: commentData.comment_uuid,
          comment: comment,
          video_uuid: video_id,
          created_at: commentData.created_at,
          updated_at: commentData.updated_at,
        },
      };
    } catch (err: any) {
      return {
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  },
  deleteComment: async (parent: unknown, input: IcommentDeleteAttributes, context: Icontext) => {
    logger.info('in delete comment api');
    const { userId } = context;
    const { comment_id } = input.input;
    const commentData = await Comment.findOne({
      where: {
        [Op.and]: [
          {
            user_id: userId,
          },
          {
            comment_uuid: comment_id,
          },
        ],
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
    await Comment.destroy({
      where: {
        comment_uuid: comment_id,
      },
    });
    return {
      message: 'Comment Deleted Successfully.',
      status_code: HttpStatus.OK,
    };
  },
  updateComment: async (parent: unknown, input: IcommentUpdateAttributes, context: Icontext) => {
    const { comment, comment_id } = input.input;
    const { userId } = context;
    logger.info('update comment');
    const commentData = await Comment.findOne({
      where: {
        [Op.and]: [
          {
            user_id: userId,
          },
          {
            comment_uuid: comment_id,
          },
        ],
      },
      raw: true,
      nest: true,
    });
    if (!commentData) {
      return {
        message: 'Comment Not Found.',
        status_code: HttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    await Comment.update(
      {
        text: comment,
      },
      { where: { comment_uuid: comment_id } }
    );
    const commentUpdatedData = await Comment.findOne({ where: { comment_uuid: comment_id }, raw: true, nest: true });
    return {
      status_code: HttpStatus.OK,
      message: 'Comment Updated Successfully.',
      data: {
        comment_uuid: commentData.comment_uuid,
        comment: comment,
        video_uuid: commentUpdatedData?.video_id,
        created_at: commentData.created_at,
        updated_at: commentData.updated_at,
      },
    };
  },
};
const commentQueryController = {};

export { commentResolverController, commentQueryController };
