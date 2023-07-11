import { logger, pubsub } from '../config';
import { HttpMessage, HttpStatus } from '../constant';
import { context, createChannel, IchannelAttributes } from '../interface/channel';
import { User, Channel, Avtar } from '../models';
import { generateUUID, picUpdatedInCloudinary, picUploadInCloudinary } from '../utils';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const storeUpload = async ({ stream, filename, mimetype }: any) => {
  const id = Date.now();
  const path = `${join(tmpdir())}/${id}${filename.replace(/ /g, '')}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ path, filename, mimetype }))
      .on('error', reject)
  );
};
const processUpload = async (upload: any) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};
const channelResolverController = {
  createChannel: async (parent: unknown, input: createChannel, context: context) => {
    try {
      const { channel_name, handle, profile_picture } = input;
      const { userId, user_uuid } = context;
      const channelData = await Channel.findOne({ where: { UserId: userId } });
      if (channelData) {
        return {
          message: 'You Can Not Create More Than One Channel.',
          status_code: 400,
        };
      }
      logger.info(JSON.stringify(input));
      if (channel_name && handle && !profile_picture) {
        logger.info('only body');
        const channelCreateData = await Channel.create({
          handle,
          chanel_uuid: generateUUID(),
          channel_name,
          UserId: userId,
        });
        return {
          status_code: 200,
          message: 'Channel Created Successfully.',
          data: {
            data: {
              handle: channelCreateData.handle,
              chanel_uuid: channelCreateData.chanel_uuid,
              channel_name: channelCreateData.channel_name,
              UserId: user_uuid,
              created_at: channelCreateData.created_at,
              updated_at: channelCreateData.updated_at,
            },
          },
        };
      } else {
        logger.info('both body and file');
        const upload: any = await processUpload(profile_picture);
        const data = await picUploadInCloudinary(upload.path);
        const channelCreateData = await Channel.create({
          handle,
          chanel_uuid: generateUUID(),
          channel_name,
          UserId: userId,
        });
        const avtarData = await Avtar.create({
          avtar_url: String(data.url),
          image_uuid: generateUUID(),
          channel_id: Number(channelCreateData.id),
          public_id: data.public_id,
        });
        return {
          status_code: 200,
          message: 'Channel Created Successfully.',
          data: {
            handle: channelCreateData.handle,
            chanel_uuid: channelCreateData.chanel_uuid,
            channel_name: channelCreateData.channel_name,
            UserId: user_uuid,
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
  updateChannel: async (paraent: unknown, input: createChannel, context: context) => {
    try {
      const { channel_name, handle, profile_picture } = input;
      const { userId, user_uuid } = context;

      const channelData: IchannelAttributes = await Channel.findOne({
        where: { UserId: userId },
        rejectOnEmpty: true,
        include: { model: Avtar, attributes: ['public_id'], as: 'Avtar' },
        raw: true,
        nest: true,
      });
      if (!channelData) {
        return {
          message: 'Channel Not Found.',
          status_code: 400,
        };
      }
      logger.info(JSON.stringify(input));
      if ((channel_name || handle) && !profile_picture) {
        logger.info('only body');
        await Channel.update(
          { handle, channel_name },
          {
            where: {
              UserId: userId,
            },
          }
        );
        const updatedChanelData = await Channel.findOne({
          where: {
            UserId: userId,
          },
        });
        return {
          status_code: 200,
          message: 'Channel Updated Successfully.',
          data: {
            handle: updatedChanelData?.handle,
            chanel_uuid: updatedChanelData?.chanel_uuid,
            channel_name: updatedChanelData?.channel_name,
            UserId: user_uuid,
            created_at: updatedChanelData?.created_at,
            updated_at: updatedChanelData?.updated_at,
          },
        };
      } else if (profile_picture && !channel_name && !handle) {
        logger.info('only profile pic');

        const upload: any = await processUpload(profile_picture);
        const data = await picUpdatedInCloudinary(String(channelData.Avtar?.public_id), upload.path);
        await Avtar.update(
          { avtar_url: data.url, public_id: data.public_id },
          {
            where: {
              channel_id: channelData.id,
            },
          }
        );
        const updatedChanelData = await Channel.findOne({
          where: {
            UserId: userId,
          },
        });
        return {
          status_code: 200,
          message: 'Channel Updated Successfully.',
          data: {
            handle: updatedChanelData?.handle,
            chanel_uuid: updatedChanelData?.chanel_uuid,
            channel_name: updatedChanelData?.channel_name,
            UserId: user_uuid,
            created_at: updatedChanelData?.created_at,
            updated_at: updatedChanelData?.updated_at,
          },
        };
      } else {
        logger.info('both body and file');
        const upload: any = await processUpload(profile_picture);
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
              UserId: userId,
            },
          }
        );
        const updatedChanelData = await Channel.findOne({
          where: {
            UserId: userId,
          },
        });
        return {
          status_code: 200,
          message: 'Channel Updated Successfully.',
          data: {
            handle: updatedChanelData?.handle,
            chanel_uuid: updatedChanelData?.chanel_uuid,
            channel_name: updatedChanelData?.channel_name,
            UserId: user_uuid,
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
};

const channelQueryController = {
  getChanelByUserId: async (paranet: unknown, input: any, context: context) => {
    try {
      logger.info('in channel query controller');
      const { userId } = context;
      const channelData = await Channel.findAll({
        where: {
          UserId: userId,
        },
        include: [
          {
            model: User,
            attributes: ['email', 'phone', 'user_uuid', 'first_name', 'last_name'],
            required: false,
          },
          {
            model: Avtar,
            required: false,
            attributes: ['avtar_url', 'image_uuid', 'public_id'],
          },
        ],
        attributes: { exclude: ['id', 'UserId'] },
      });

      logger.info(JSON.stringify(channelData));
      return {
        message: 'Get Channel List Successfully.',
        status_code: 200,
        data: channelData[0],
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
