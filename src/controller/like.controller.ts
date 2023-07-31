import { Op } from 'sequelize';
import { HttpStatus } from '../constant';
import { Icontext, IlikeCreateReq } from '../interface';
import { Like, Video } from '../models';
import { generateUUID } from '../utils';

const likeResolverController = {
  createLike: async (parent: unknown, input: IlikeCreateReq, Icontext: Icontext) => {
    try {
      const { type, video_id } = input.input;
      const { userId } = Icontext;
      const videoData = await Video.findOne({ where: { video_uuid: video_id }, raw: true, nest: true });
      if (!videoData) {
        return {
          status_code: HttpStatus.OK,
          message: 'Video Not Found.',
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
          message: 'Feedback shared with the creator',
          status_code: 200,
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
            message: 'Feedback shared with the creator',
            status_code: 200,
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
            message: 'Feedback shared with the creator',
            status_code: 200,
            data: {
              count: likeCount,
            },
          };
        }
      }
    } catch (err: any) {
      return {
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  },
};
const likeQueryController = {};

export { likeResolverController, likeQueryController };
