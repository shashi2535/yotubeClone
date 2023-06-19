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
  getChanel: async () => {
    try {
      const channelData = await Channel.findAll({
        include: [
          {
            model: User,
            required: false,
          },
        ],
      });
      logger.info(JSON.stringify(channelData));
      return 'hello';
    } catch (err) {
      // console.log(err);
    }
    // console.log(channelData);
  },
};

export { channelQueryController, channelResolverController };
