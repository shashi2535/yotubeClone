import i18next from 'i18next';
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
    try {
      const { comment, comment_id } = input.input;
      const { userId } = context;
      const commentData = await Comment.findOne({ where: { comment_uuid: comment_id }, raw: true, nest: true });
      if (!commentData) {
        return {
          message: i18next.t('STATUS.COMMENT_NOT_FOUND'),
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
        message: i18next.t('STATUS.SUB_COMMENT_SUCCESSFULLY'),
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
  updateSubComment: async (parent: unknown, input: IUpdateSubComment, context: Icontext) => {
    try {
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
          message: i18next.t('STATUS.SUB_COMMENT_NOT_FOUND'),
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
        message: i18next.t('STATUS.SUB_COMMENT_UPDATED_SUCCESSFULLY'),
        data: {
          comment_uuid: subCommentUpdatedData?.Comment?.comment_uuid,
          sub_comment_uuid: subCommentUpdatedData?.sub_comment_uuid,
          comment: subCommentUpdatedData?.sub_comment,
          created_at: subCommentUpdatedData?.created_at,
          updated_at: subCommentUpdatedData?.updated_at,
          video_uuid: subCommentUpdatedData?.Comment?.Comment_Video?.video_uuid,
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
  removeSubComment: async (parent: unknown, input: IDeleteSubComment, context: Icontext) => {
    try {
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
          message: i18next.t('STATUS.SUB_COMMENT_NOT_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
        };
      }
      await Sub_Comment.destroy({
        where: {
          sub_comment_uuid: sub_comment_id,
        },
      });
      return {
        message: i18next.t('STATUS.SUB_COMMENT_DELETED_SUCCESSFULLY'),
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
};
const subCommentQueryController = {
  getSubCommentByCommentId: async (parent: unknown, input: IcommentDeleteAttributes, context: Icontext) => {
    try {
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
          message: i18next.t('STATUS.COMMENT_NOT_FOUND'),
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
        message: i18next.t('STATUS.GET_SUB_COMMENT_LIST'),
        status_code: HttpStatus.OK,
        data: subComentData,
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

export { subCommentResolverController, subCommentQueryController };
