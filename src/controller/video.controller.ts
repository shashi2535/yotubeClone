import i18next from 'i18next';
import { logger } from '../config';
import { HttpStatus, VideoTypes } from '../constant';
import { Icontext, ICreateVideo } from '../interface';
import { Channel, Video } from '../models';
import { generateUUID, videoStoreInTmpFolder, videoUploadInCloudinary } from '../utils';
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
  deleteVideo: async () => {
    logger.info('in delete video controller ');
  },
};
const videoQueryController = {};

export { videoQueryController, videoResolverController };
