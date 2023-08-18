import i18next from 'i18next';
import { Op } from 'sequelize';
import { logger } from '../config';
import { HttpStatus } from '../constant';
import { IcreateVideoTrack, Icontext } from '../interface';
import { Video, Video_track } from '../models';
import { convertIntoMiliSecond, generateUUID } from '../utils';

const videoTrackResolverController = {
  create_video_track: async (parent: unknown, input: IcreateVideoTrack, context: Icontext) => {
    try {
      const { duration, video_id } = input.input;
      const { userId, user_uuid } = context;
      logger.info('create video track');
      const videoData = await Video.findOne({ where: { video_uuid: video_id }, raw: true, nest: true });
      if (!videoData) {
        return {
          status_code: HttpStatus.BAD_REQUEST,
          message: i18next.t('STATUS.VIDEO_NOT_FOUND'),
        };
      }
      const videoTrackData = await Video_track.findOne({
        where: {
          [Op.and]: [{ user_id: userId }, { video_id: videoData.id }],
        },
        raw: true,
        nest: true,
      });
      const milisecond = convertIntoMiliSecond(Number(duration));
      if (!videoTrackData) {
        const videoTrackData = await Video_track.create({
          video_id: videoData.id,
          user_id: userId,
          start_time: milisecond,
          end_time: videoData.duration,
          video_track_uuid: generateUUID(),
        });
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.VIDEO_TRACK_CREATED_SUCCESSFULLY'),
          data: {
            user_id: user_uuid,
            start_time: videoTrackData.start_time,
            end_time: videoTrackData.end_time,
            video_track_uuid: videoTrackData.video_track_uuid,
            video_id: videoData.video_uuid,
          },
        };
      } else {
        if (videoTrackData.start_time === milisecond) {
          await Video_track.update(
            {
              is_watched: true,
            },
            {
              where: {
                [Op.and]: [{ user_id: userId }, { video_id: videoData.id }],
              },
            }
          );
          return;
        }
        await Video_track.update(
          {
            start_time: milisecond,
          },
          {
            where: {
              [Op.and]: [{ user_id: userId }, { video_id: videoData.id }],
            },
          }
        );
        const updatedVideoTrackData = await Video_track.findOne({
          where: {
            [Op.and]: [{ user_id: userId }, { video_id: videoData.id }],
          },
          raw: true,
          nest: true,
        });
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.VIDEO_TRACK_UPDATED_SUCCESSFULLY'),
          data: {
            user_id: user_uuid,
            start_time: updatedVideoTrackData?.start_time,
            end_time: updatedVideoTrackData?.end_time,
            video_track_uuid: updatedVideoTrackData?.video_track_uuid,
            video_id: videoData.video_uuid,
          },
        };
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
const videoTrackQueryController = {};

export { videoTrackResolverController, videoTrackQueryController };
