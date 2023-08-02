import i18next from 'i18next';
import { Op } from 'sequelize';
import { logger } from '../config';
import { HttpStatus } from '../constant';
import {
  IcommentCreateAttributes,
  IcommentDeleteAttributes,
  IcommentUpdateAttributes,
  Icontext,
  IdeleteVideo,
  ILikeOnComment,
} from '../interface';
import { Comment, Like, User, Video } from '../models';
import { Sub_Comment } from '../models/sub_comment';
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
          message: i18next.t('STATUS.VIDEO_NOT_FOUND'),
        };
      }
      const commentData = await Comment.create({
        comment_uuid: generateUUID(),
        text: comment,
        user_id: userId,
        video_id: videoData.id,
        video_uuid: videoData.video_uuid,
      });
      return {
        status_code: HttpStatus.OK,
        message: i18next.t('STATUS.COMMENT_ADDED'),
        data: {
          comment_uuid: commentData.comment_uuid,
          comment: comment,
          video_uuid: video_id,
          created_at: commentData.created_at,
          updated_at: commentData.updated_at,
        },
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
  deleteComment: async (parent: unknown, input: IcommentDeleteAttributes, context: Icontext) => {
    logger.info('in delete comment api');
    try {
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
          message: i18next.t('STATUS.COMMENT_NOT_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
        };
      }
      await Comment.destroy({
        where: {
          comment_uuid: comment_id,
        },
      });
      return {
        message: i18next.t('STATUS.COMMENT_DELETED_SUCCESSFULLY'),
        status_code: HttpStatus.OK,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
  updateComment: async (parent: unknown, input: IcommentUpdateAttributes, context: Icontext) => {
    try {
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
          message: i18next.t('STATUS.COMMENT_NOT_FOUND'),
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
        message: i18next.t('STATUS.COMMENT_UPDATED_SUCCESSFULLY'),
        data: {
          comment_uuid: commentData.comment_uuid,
          comment: comment,
          video_uuid: commentUpdatedData?.video_id,
          created_at: commentData.created_at,
          updated_at: commentData.updated_at,
        },
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
  likeOnComment: async (parent: unknown, input: ILikeOnComment, context: Icontext) => {
    try {
      const { type, comment_id } = input.input;
      const { userId } = context;
      const commentData = await Comment.findOne({ where: { comment_uuid: comment_id }, raw: true, nest: true });
      if (!commentData) {
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.COMMENT_NOT_FOUND'),
        };
      }
      // { video_uuid: video_id }
      const likeData = await Like.findOne({
        where: {
          [Op.and]: [{ comment_id: commentData.id }, { user_id: userId }],
        },
      });
      if (!likeData) {
        await Like.create({
          like_uuid: generateUUID(),
          user_id: userId,
          comment_id: commentData.id,
          reaction: type,
        });
        const commentCount = await Like.count({ where: { comment_id: commentData.id } });
        return {
          message: i18next.t('STATUS.FEEDBACK_SEND_TO_CREATER_SUCCESSFULLY'),
          status_code: HttpStatus.OK,
          data: {
            count: commentCount,
          },
        };
      }
      if (likeData) {
        if (type === likeData.reaction) {
          await Like.destroy({
            where: {
              [Op.and]: [{ comment_id: commentData.id }, { user_id: userId }],
            },
          });
          const videoCount = await Like.count({ where: { comment_id: commentData.id } });
          return {
            message: i18next.t('STATUS.FEEDBACK_SEND_TO_CREATER_SUCCESSFULLY'),
            status_code: HttpStatus.OK,
            data: {
              count: videoCount,
            },
          };
        } else {
          const [, , likeCount] = await Promise.all([
            Like.destroy({
              where: {
                [Op.and]: [{ comment_id: commentData.id }, { user_id: userId }],
              },
            }),
            Like.create({
              like_uuid: generateUUID(),
              user_id: userId,
              comment_id: commentData.id,
              reaction: type,
            }),
            Like.count({ where: { comment_id: commentData.id } }),
          ]).catch((err) => {
            throw err;
          });
          return {
            message: i18next.t('STATUS.FEEDBACK_SEND_TO_CREATER_SUCCESSFULLY'),
            status_code: HttpStatus.OK,
            data: {
              count: likeCount,
            },
          };
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
};
const commentQueryController = {
  getCommentByVideoId: async (parent: unknown, input: IdeleteVideo, context: Icontext) => {
    try {
      const { video_id } = input;
      const comment: any = await Comment.findAll({
        where: { video_uuid: video_id },
        raw: true,
        nest: true,
        include: [{ model: User, as: 'User_Comment', attributes: ['email', 'first_name', 'last_name'] }],
      });
      // const arr: any = [];
      const data = await Promise.all(
        comment.map(async (element: any) => {
          const count = await Sub_Comment.count({ where: { comment_id: element.id } });
          element.count = count;
          return element;
          // arr.push(element);
        })
      );
      return {
        status_code: HttpStatus.OK,
        message: i18next.t('STATUS.GET_COMMENT_LIST'),
        data: comment,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
};

export { commentResolverController, commentQueryController };
