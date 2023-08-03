import { logger } from '../config';
import { HttpStatus } from '../constant';
import { Icontext, IcreateChannel, IchannelAttributes, IdeleteChannel, IupdateChannel } from '../interface/';
import { User, Channel, Avtar, Subscribe } from '../models';
import { generateUUID, picStoreInTmpFolder, picUpdatedInCloudinary, picUploadInCloudinary } from '../utils';
import i18next from 'i18next';

const channelResolverController = {
  createChannel: async (parent: unknown, input: IcreateChannel, context: Icontext) => {
    try {
      const { channel_name, handle, profile_picture } = input;
      const { userId, user_uuid } = context;
      const channelData = await Channel.findOne({ where: { user_id: userId } });
      if (channelData) {
        return {
          message: i18next.t('STATUS.CAN_NOT_CREATE_CHANNEL'),
          status_code: HttpStatus.BAD_GATEWAY,
        };
      }
      logger.info(JSON.stringify(input));
      if (channel_name && handle && !profile_picture) {
        logger.info('only body');
        const channelCreateData = await Channel.create({
          handle,
          chanel_uuid: generateUUID(),
          channel_name,
          user_id: userId,
        });
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.CHANNEL_CREATED'),
          data: {
            data: {
              handle: channelCreateData.handle,
              chanel_uuid: channelCreateData.chanel_uuid,
              channel_name: channelCreateData.channel_name,
              user_id: user_uuid,
              created_at: channelCreateData.created_at,
              updated_at: channelCreateData.updated_at,
            },
          },
        };
      } else {
        logger.info('both body and file');
        const upload: any = await picStoreInTmpFolder(profile_picture);
        const data = await picUploadInCloudinary(upload.path);
        const channelCreateData = await Channel.create({
          handle,
          chanel_uuid: generateUUID(),
          channel_name,
          user_id: userId,
        });
        const avtarData = await Avtar.create({
          avtar_url: String(data.url),
          image_uuid: generateUUID(),
          channel_id: Number(channelCreateData.id),
          public_id: data.public_id,
        });
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.CHANNEL_CREATED'),
          data: {
            handle: channelCreateData.handle,
            chanel_uuid: channelCreateData.chanel_uuid,
            channel_name: channelCreateData.channel_name,
            user_id: user_uuid,
            url: avtarData.avtar_url,
            created_at: channelCreateData.created_at,
            updated_at: channelCreateData.updated_at,
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
  updateChannel: async (paraent: unknown, input: IcreateChannel, Icontext: Icontext) => {
    try {
      const { channel_name, handle, profile_picture } = input;
      const { userId, user_uuid } = Icontext;

      const channelData: IchannelAttributes = await Channel.findOne({
        where: { user_id: userId },
        rejectOnEmpty: true,
        include: { model: Avtar, attributes: ['public_id'], as: 'Avtar' },
        raw: true,
        nest: true,
      });
      if (!channelData) {
        return {
          message: i18next.t('STATUS.CHANNEL_NOT_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
        };
      }
      logger.info(JSON.stringify(input));
      if ((channel_name || handle) && !profile_picture) {
        logger.info('only body');
        await Channel.update(
          { handle, channel_name },
          {
            where: {
              user_id: userId,
            },
          }
        );
        const updatedChanelData: IchannelAttributes = (await Channel.findOne({
          where: {
            user_id: userId,
          },
          include: [{ model: Avtar, attributes: ['avtar_url'], as: 'Avtar' }],
        })) as any;
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.CHANNEL_UPDATED_SUCCESSFULLY'),
          data: {
            handle: updatedChanelData?.handle,
            chanel_uuid: updatedChanelData?.chanel_uuid,
            channel_name: updatedChanelData?.channel_name,
            user_id: user_uuid,
            created_at: updatedChanelData?.created_at,
            updated_at: updatedChanelData?.updated_at,
            url: updatedChanelData?.Avtar?.avtar_url,
          },
        };
      } else if (profile_picture && !channel_name && !handle) {
        logger.info('only profile pic');

        const upload: any = await picStoreInTmpFolder(profile_picture);
        const data = await picUpdatedInCloudinary(String(channelData.Avtar?.public_id), upload.path);
        await Avtar.update(
          { avtar_url: data.url, public_id: data.public_id },
          {
            where: {
              channel_id: channelData.id,
            },
          }
        );
        const updatedChanelData: IchannelAttributes = (await Channel.findOne({
          where: {
            user_id: userId,
          },
          include: [{ model: Avtar, attributes: ['avtar_url'], as: 'Avtar' }],
        })) as any;

        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.CHANNEL_UPDATED_SUCCESSFULLY'),
          data: {
            handle: updatedChanelData?.handle,
            chanel_uuid: updatedChanelData?.chanel_uuid,
            channel_name: updatedChanelData?.channel_name,
            user_id: user_uuid,
            created_at: updatedChanelData?.created_at,
            updated_at: updatedChanelData?.updated_at,
            url: updatedChanelData?.Avtar?.avtar_url,
          },
        };
      } else {
        logger.info('both body and file');
        const upload: any = await picStoreInTmpFolder(profile_picture);
        const data = await picUpdatedInCloudinary(String(channelData.Avtar?.public_id), upload.path);
        await Avtar.update(
          { avtar_url: data.url, public_id: data.public_id },
          {
            where: {
              channel_id: channelData.id,
            },
          }
        );
        await Channel.update(
          { handle, channel_name },
          {
            where: {
              user_id: userId,
            },
          }
        );
        const updatedChanelData = await Channel.findOne({
          where: {
            user_id: userId,
          },
        });
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.CHANNEL_UPDATED_SUCCESSFULLY'),
          data: {
            handle: updatedChanelData?.handle,
            chanel_uuid: updatedChanelData?.chanel_uuid,
            channel_name: updatedChanelData?.channel_name,
            user_id: user_uuid,
            created_at: updatedChanelData?.created_at,
            updated_at: updatedChanelData?.updated_at,
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
  deleteChannel: async (paraent: unknown, input: IdeleteChannel, context: Icontext) => {
    try {
      const { userId, user_uuid } = context;
      logger.info(`in delete channel ${userId}`);
      const channelData = await Channel.findOne({ where: { user_id: userId }, raw: true, nest: true });
      if (!channelData) {
        return {
          message: i18next.t('STATUS.CHANNEL_NOT_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
        };
      }
      await Channel.destroy({ where: { user_id: userId } });
      await Avtar.destroy({ where: { channel_id: channelData.id } });
      return {
        status_code: HttpStatus.OK,
        message: i18next.t('STATUS.CHANNEL_DELETED_SUCCESSFULLY'),
        data: {
          handle: channelData?.handle,
          chanel_uuid: channelData?.chanel_uuid,
          channel_name: channelData?.channel_name,
          user_id: user_uuid,
          created_at: channelData?.created_at,
          updated_at: channelData?.updated_at,
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
  verifiedChannelByAdmin: async (paraent: unknown, input: IupdateChannel, context: Icontext) => {
    try {
      const { channel_id } = input;
      logger.info(`verifiedChannelByAdmin>>>>>>${channel_id}`);
      const channelData = await Channel.findOne({ where: { chanel_uuid: channel_id }, raw: true, nest: true });
      if (!channelData) {
        return {
          status_code: HttpStatus.BAD_REQUEST,
          message: i18next.t('STATUS.CHANNEL_NOT_FOUND'),
        };
      }
      if (channelData.is_verified) {
        return {
          status_code: HttpStatus.BAD_REQUEST,
          message: i18next.t('STATUS.CHANNEL_ALREADY_VERIFIED'),
        };
      }
      const subscribeCountData = await Subscribe.count({ where: { subscribed_channel_uuid: channel_id } });
      if (subscribeCountData >= 1) {
        await Channel.update({ is_verified: true }, { where: { chanel_uuid: channel_id } });
        return {
          status_code: HttpStatus.OK,
          message: i18next.t('STATUS.CHANNEL_VERIFIED_SUCCESSFULLY'),
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

const channelQueryController = {
  getChanelByUserId: async (paranet: unknown, input: null, context: Icontext) => {
    try {
      const { userId, user_uuid } = context;
      const channelData: IchannelAttributes = (await Channel.findOne({
        where: {
          user_id: userId,
          // chanel_uuid: channel_id,
        },
        include: [
          {
            model: User,
            attributes: ['email', 'phone', 'user_uuid', 'first_name', 'last_name'],
            required: false,
            as: 'User',
          },
          {
            model: Avtar,
            required: false,
            attributes: ['avtar_url', 'image_uuid', 'public_id'],
            as: 'Avtar',
          },
        ],
        attributes: { exclude: ['user_id'] },
        raw: true,
        nest: true,
      })) as any;
      if (!channelData) {
        return {
          message: i18next.t('STATUS.CHANNEL_NOT_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
        };
      }
      const subscribeCountData = await Subscribe.findAndCountAll({ where: { subscribed_channel_id: channelData.id } });
      return {
        message: i18next.t('STATUS.GET_CHANNEL_LIST_SUCCESSFULLY'),
        status_code: HttpStatus.OK,
        data: {
          chanel_uuid: channelData.chanel_uuid,
          channel_name: channelData.channel_name,
          handle: channelData.handle,
          discription: channelData.discription,
          created_at: channelData.created_at,
          updated_at: channelData.updated_at,
          url: channelData.Avtar?.avtar_url,
          subscriber_count: subscribeCountData.count,
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
};

export { channelQueryController, channelResolverController };

// >>>>>>     for the create user  <<<<<<<<<<
//  {
//   "input": {
//     "last_name": "sethiya",
//     "email": "shashi200@yopmail.com",
//     "first_name": "shashikant",
//     "password": "12345678",
//     "phone": "9039332535"
//   }
// }

// >>>>>>    for the otp verification by phone  <<<<<<<<<<

// {  "input":{
//     "otp": "279978",
//     "phone": "9039332535"
//   }}

// >>>>>>    for the resend otp on phone  <<<<<<<<<<

// {
//   "input":{
//     "user_uuid": "db0c33dd-5482-4e31-ad3a-8694dbb5a9db"
//   }
// }

// >>>>>>   for the code verification by email  <<<<<<<<<<
// {
//   "input":{
//     "email":"shashi200@yopmail.com",
//     "code":"db126401"
//   }
// }

// >>>>>>    for the resend otp on email  <<<<<<<<<<

// {
//   "input":{
//     "user_uuid": "be46874f-d499-40f7-910c-8e3fec78db78"
//   }
// }

// >>>>>>    For The Login User  <<<<<<<<<<
// {
//   "input":{
//     "email":"shashi200@yopmail.com",
//     "password":"12345678"
//   }
// }

// >>>>>>    For The Create Channel  <<<<<<<<<<
// {
//   "input":{
//   "channel_name":"fdsfsfdasffff",
//   "handle":"fffffffffffffffffffffff"
//   }
// }

// >>>>>>    For The Create Video  <<<<<<<<<<
// {
//   "createVideoInput":{
//     "title":"rtrer",
//     "description":"sadfdas"
//   }
// }

// >>>>>>>   For The Like Video  <<<<<<<<<<<<
//  {
//    "likeCreateReq":{
//      "type":"dislike",
//   "video_id":"87c714d6-a16c-44ee-ac1e-6d777ebc540d"
//    }
//  }

// >>>>>>>   For The create comment on Video  <<<<<<<<<<<<
//  {
//   "createCommentReq":{
//   "video_id":"87c714d6-a16c-44ee-ac1e-6d777ebc540d",
//   "comment":"very good"
//   }
//  }

// >>>>>>>   For The delete comment on Video  <<<<<<<<<<<<
//  {
//   "deleteCommentReq":{
//   "comment_id":"437207d2-e796-4a8d-894e-788538af1fb1"
//   }
//  }

// >>>>>>>   For The update comment on Video  <<<<<<<<<<<<
//  {
//   "updateCommentReq":{
//   "comment_id":"a1373d2b-56f9-4ae0-9312-e45498220c9c",
//     "comment":"very good updated"
//   }
//  }
