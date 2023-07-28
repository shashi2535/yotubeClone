import i18next from 'i18next';
import { Op } from 'sequelize';
import { logger } from '../config';
import { HttpStatus, VideoTypes } from '../constant';
import { Icontext, ICreateVideo, IdeleteVideo, IUpdateVideo } from '../interface';
import { Channel, Video } from '../models';
import { generateUUID, videoStoreInTmpFolder, videoDeleteInCloudinary, videoUploadInCloudinary } from '../utils';
interface data {
  secure_url?: string;
  duration?: string;
  public_id?: string;
}
const videoResolverController = {
  createVideo: async (parent: unknown, input: ICreateVideo, context: Icontext) => {
    try {
      const {
        input: { description, title },
        video_url,
      } = input;
      const { userId } = context;
      const channelData = await Channel.findOne({ where: { UserId: userId } });
      if (!channelData) {
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.CHANNEL_NOT_FOUND'),
          data: null,
        };
      }
      const upload: any = await videoStoreInTmpFolder(video_url);
      const data: data = await videoUploadInCloudinary(upload.path);
      const duration = Number(data.duration).toFixed(2);
      let type;
      if (Number(duration) < 32) {
        type = VideoTypes.SHORT;
      } else {
        type = VideoTypes.VIDEO;
      }
      const videoCreateData = await Video.create({
        title,
        description,
        channel_id: channelData.id,
        user_id: userId,
        video_url: data?.secure_url,
        video_uuid: generateUUID(),
        type,
        public_id: data.public_id,
      });
      return {
        status_code: HttpStatus.OK,
        message: i18next.t('STATUS.VIDEO_UPLOADED'),
        data: {
          video_uuid: videoCreateData.dataValues.video_uuid,
          url: videoCreateData.dataValues.video_url,
          created_at: videoCreateData.dataValues.created_at,
          updated_at: videoCreateData.dataValues.updated_at,
          type: videoCreateData.dataValues.type,
          title: videoCreateData.dataValues.title,
          description: videoCreateData.dataValues.description,
        },
      };
    } catch (err: any) {
      throw new Error(err.message);
    }
  },
  deleteVideo: async (parent: unknown, input: IdeleteVideo, context: Icontext) => {
    const { video_id } = input;
    const { userId } = context;
    const videoData = await Video.findOne({ where: { video_uuid: video_id, user_id: userId }, raw: true, nest: true });
    // logger.info(`in delete video controller ${JSON.stringify(videoData)}`);
    if (!videoData) {
      return {
        message: 'Video Not Found',
        status_code: HttpStatus.BAD_REQUEST,
      };
    }
    await videoDeleteInCloudinary(`${videoData?.public_id}`);
    await Video.destroy({ where: { video_uuid: video_id } });
    return {
      message: 'Video Deleted Successfully.',
      status_code: HttpStatus.OK,
    };
  },
  updateVideo: async (parent: unknown, input: IUpdateVideo, context: Icontext) => {
    const { description, title, video_id } = input.input;
    const { userId } = context;
    const videoData = await Video.findOne({
      where: {
        video_uuid: video_id,
        user_id: userId,
      },
      raw: true,
      nest: true,
    });
    if (!videoData) {
      return {
        message: 'Video Not Found.',
        status_code: HttpStatus.BAD_REQUEST,
      };
    }
    await Video.update(
      {
        title,
        description,
      },
      { where: { video_uuid: video_id } }
    );
    return {
      message: 'Video Updated Successfully.',
      status_code: HttpStatus.OK,
      data: {
        video_uuid: videoData.dataValues.video_uuid,
        url: videoData.dataValues.video_url,
        created_at: videoData.dataValues.created_at,
        updated_at: videoData.dataValues.updated_at,
        type: videoData.dataValues.type,
        title: title,
        description: description,
      },
    };
  },
  update_video_view: async (parent: unknown, input: IdeleteVideo, context: Icontext) => {
    const { userId } = context;
    const { video_id } = input;
    const videoData = await Video.findOne({ where: { video_uuid: video_id }, raw: true, nest: true });
    if (!videoData) {
      return {
        message: 'Video Not Found',
        status_code: HttpStatus.BAD_REQUEST,
        data: null,
      };
    }
    if (videoData.user_id === userId) {
      return {
        message: 'Video Not Found',
        status_code: HttpStatus.BAD_REQUEST,
        data: {
          video_view: videoData.video_view,
        },
      };
    } else {
      await Video.update({ video_view: Number(videoData?.video_view) + 1 }, { where: { video_uuid: video_id } });
      const updatedVideoData = await Video.findOne({ where: { video_uuid: video_id }, raw: true, nest: true });
      return {
        message: 'Video Not Found',
        status_code: HttpStatus.BAD_REQUEST,
        data: {
          video_view: updatedVideoData?.video_view,
        },
      };
    }
  },
};
const videoQueryController = {};

export { videoQueryController, videoResolverController };
