import i18next from 'i18next';
import { IchannelAttributes, Icontext, IcreateSubscribe } from '../interface';
import { Channel, Subscribe, User } from '../models';
import { generateUUID } from '../utils';

const subscribeResolverController = {
  createSubscribe: async (parent: unknown, args: IcreateSubscribe, context: Icontext) => {
    const { channel_id } = args.input;
    const { user_uuid, userId } = context;

    const channelData: IchannelAttributes = (await Channel.findOne({
      where: { chanel_uuid: channel_id },
      include: [
        {
          model: User,
          as: 'User',
        },
      ],
      raw: true,
      nest: true,
    })) as IchannelAttributes;
    if (!channelData) {
      return {
        status_code: 400,
        message: i18next.t('STATUS.CHANNEL_NOT_FOUND'),
      };
    }
    if (channelData.User?.user_uuid === user_uuid) {
      return {
        status_code: 400,
        message: 'You Can Not Subscribe Your Own Channel.',
      };
    }
    const subscribeData = await Subscribe.findOne({ where: { subscribed_user_id: userId } });
    if (subscribeData) {
      return {
        status_code: 400,
        message: 'Already Subscribed This Channel.',
      };
    }
    const subscribeCreateData = await Subscribe.create({
      subscribed_channel_id: channelData.id,
      subscribe_uuid: generateUUID(),
      subscribed_user_id: userId,
    });
    return {
      status_code: 200,
      message: 'Channel Subscribed Sussessfully.',
      data: {
        subscibe_id: subscribeCreateData.dataValues.subscribe_uuid,
        channel_id: channel_id,
        user_id: user_uuid,
      },
    };
  },
};
const subscribeSchemaController = {};

export { subscribeResolverController, subscribeSchemaController };
