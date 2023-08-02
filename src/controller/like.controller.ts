import i18next from 'i18next';
import { Op } from 'sequelize';
import { HttpStatus } from '../constant';
import { Icontext, IlikeCreateReq } from '../interface';
import { Like, Video } from '../models';
import { generateUUID } from '../utils';

const likeResolverController = {
  createLike: async (parent: unknown, input: IlikeCreateReq, context: Icontext) => {
    try {
      const { type, video_id } = input.input;
      const { userId } = context;
      const videoData = await Video.findOne({ where: { video_uuid: video_id }, raw: true, nest: true });
      if (!videoData) {
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.VIDEO_NOT_FOUND'),
        };
      }
      // { video_uuid: video_id }
      const likeData = await Like.findOne({
        where: {
          [Op.and]: [{ video_uuid: video_id }, { user_id: userId }],
        },
      });
      if (!likeData) {
        await Like.create({
          like_uuid: generateUUID(),
          user_id: userId,
          video_id: videoData.id,
          video_uuid: video_id,
          reaction: type,
        });
        const videoCount = await Like.count({ where: { video_uuid: video_id } });

        return {
          message: i18next.t('STATUS.FEEDBACK_SEND_TO_CREATER_SUCCESSFULLY'),
          status_code: HttpStatus.OK,
          data: {
            count: videoCount,
          },
        };
      }
      if (likeData) {
        if (type === likeData.reaction) {
          await Like.destroy({
            where: {
              [Op.and]: [{ video_uuid: video_id }, { user_id: userId }],
            },
          });
          const videoCount = await Like.count({ where: { video_uuid: video_id } });
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
                [Op.and]: [{ video_uuid: video_id }, { user_id: userId }],
              },
            }),
            Like.create({
              like_uuid: generateUUID(),
              user_id: userId,
              video_id: videoData.id,
              video_uuid: video_id,
              reaction: type,
            }),
            Like.count({ where: { video_uuid: video_id } }),
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
const likeQueryController = {};

export { likeResolverController, likeQueryController };
