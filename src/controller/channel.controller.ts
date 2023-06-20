import { logger } from '../config';
import { HttpMessage } from '../constant';
import { context, createChannel } from '../interface/channel';
import { User } from '../models';
import { Channel } from '../models/channel';
import { generateUUID } from '../utils';

const channelResolverController = {
  createChannel: async (parent: unknown, input: createChannel, context: context) => {
    const { channel_name, handle } = input.input;
    if (Object.keys(context).length === 0) {
      return {
        status_code: 400,
        message: HttpMessage.TOKEN_REQUIRED,
      };
    }
    const { userId, user_uuid } = context;

    const channelData = await Channel.findOne({ where: { UserId: userId } });
    logger.info(JSON.stringify(channelData?.dataValues));
    if (channelData?.dataValues) {
      return {
        message: 'You Can Not Create More Than One Channel.',
        status_code: 400,
      };
    }
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
        handle: channelCreateData.handle,
        chanel_uuid: channelCreateData.chanel_uuid,
        channel_name: channelCreateData.channel_name,
        UserId: user_uuid,
      },
    };
  },
};

const channelQueryController = {
  getChanelByUserId: async (paranet: unknown, input: any, context: context) => {
    try {
      if (Object.keys(context).length === 0) {
        return {
          status_code: 400,
          message: HttpMessage.TOKEN_REQUIRED,
        };
      }
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
        ],
        attributes: { exclude: ['id', 'UserId'] },
      });
      logger.info(JSON.stringify(channelData));
      return {
        message: 'Get Channel List Successfully.',
        status_code: 200,
      };
    } catch (err) {
      // console.log(err);
    }
    // console.log(channelData);
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
