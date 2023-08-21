import i18next from 'i18next';
import { logger } from '../config';
import { HttpStatus, VideoTypes } from '../constant';
import { Icontext, ICreateVideo, IdeleteVideo, IGetVideo, IUpdateVideo } from '../interface';
import { Avtar, Channel, User, Video } from '../models';
import { SequelizeFilterSortUtil } from '../service';
import {
  generateUUID,
  videoStoreInTmpFolder,
  videoDeleteInCloudinary,
  videoUploadInCloudinary,
  convertIntoMiliSecond,
} from '../utils';

const videoResolverController = {
  createVideo: async (parent: unknown, input: ICreateVideo, context: Icontext) => {
    try {
      const {
        input: { description, title },
        video_url,
      } = input;
      const { userId } = context;
      const channelData = await Channel.findOne({ where: { user_id: userId }, attributes: { exclude: ['UserId'] } });
      if (!channelData) {
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.CHANNEL_NOT_FOUND'),
          data: null,
        };
      }
      const upload: any = await videoStoreInTmpFolder(video_url);
      const data = await videoUploadInCloudinary(upload.path);
      const duration = Number(data.duration).toFixed(2);
      const milisecond = convertIntoMiliSecond(Number(data?.duration));
      let type: string;
      if (Number(duration) < 32) {
        type = VideoTypes.SHORT;
      } else {
        type = VideoTypes.VIDEO;
      }
      const videoCreateData = await Video.create({
        title,
        description,
        channel_id: channelData?.id,
        user_id: userId,
        video_url: data?.secure_url,
        video_uuid: generateUUID(),
        type,
        public_id: data.public_id,
        duration: milisecond,
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
  deleteVideo: async (parent: unknown, input: IdeleteVideo, context: Icontext) => {
    try {
      const { video_id } = input;
      const { userId } = context;
      const videoData = await Video.findOne({
        where: { video_uuid: video_id, user_id: userId },
        raw: true,
        nest: true,
      });
      if (!videoData) {
        return {
          message: i18next.t('STATUS.VIDEO_NOT_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
        };
      }
      await videoDeleteInCloudinary(`${videoData?.public_id}`);
      await Video.destroy({ where: { video_uuid: video_id } });
      return {
        message: i18next.t('STATUS.VIDEO_DELETED_SUCCESSFULLY'),
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
  updateVideo: async (parent: unknown, input: IUpdateVideo, context: Icontext) => {
    try {
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
          message: i18next.t('STATUS.VIDEO_NOT_FOUND'),
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
        message: i18next.t('STATUS.VIDEO_UPDATED_SUCCESSFULLY'),
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
  update_video_view: async (parent: unknown, input: IdeleteVideo, context: Icontext) => {
    try {
      const { userId } = context;
      const { video_id } = input;
      const videoData = await Video.findOne({ where: { video_uuid: video_id }, raw: true, nest: true });
      if (!videoData) {
        return {
          message: i18next.t('STATUS.VIDEO_NOT_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
          data: null,
        };
      }
      if (videoData.user_id === userId) {
        return {
          message: i18next.t('STATUS.VIDEO_VIEW_NOT_UPDATED'),
          status_code: HttpStatus.BAD_REQUEST,
          data: {
            video_view: videoData.video_view,
          },
        };
      } else {
        await Video.update({ video_view: Number(videoData?.video_view) + 1 }, { where: { video_uuid: video_id } });
        const updatedVideoData = await Video.findOne({ where: { video_uuid: video_id }, raw: true, nest: true });
        return {
          message: i18next.t('STATUS.VIDEO_VIEW_UPDATED_SUCCESSFULLY'),
          status_code: HttpStatus.OK,
          data: {
            video_view: updatedVideoData?.video_view,
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
const videoQueryController = {
  getVideo: async (parent: unknown, input: IGetVideo, context: Icontext) => {
    try {
      logger.info('get video app');
      const query = { ...input.input };
      query.fields = 'video_uuid, title, type';
      const filterSortUtil = new SequelizeFilterSortUtil(Video);
      const filteredAndSortedProducts = await filterSortUtil.filterSort(query, {
        attributes: [
          'video_uuid',
          'video_url',
          'description',
          'type',
          'duration',
          'title',
          'public_id',
          'video_view',
          'created_at',
        ],
        include: [
          {
            model: User,
            attributes: ['email', 'phone', 'user_uuid', 'first_name', 'last_name'],
            required: false,
            as: 'User_Video',
          },
          {
            model: Channel,
            required: false,
            as: 'Channel_Video',
            attributes: { exclude: ['UserId', 'created_at', 'updated_at', 'user_id', 'id', 'is_verified'] },
            include: {
              model: Avtar,
              as: 'Avtar',
              attributes: ['avtar_url', 'image_uuid', 'public_id'],
            },
          },
        ],
      });
      return {
        status_code: HttpStatus.OK,
        message: 'Get Video Data Successfully',
        data: filteredAndSortedProducts,
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

export { videoQueryController, videoResolverController };
