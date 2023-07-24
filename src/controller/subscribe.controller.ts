import i18next from 'i18next';
import { logger } from '../config';
import { HttpStatus } from '../constant';
import { IchannelAttributes, Icontext, IcreateSubscribe, IRemoveSubscribe } from '../interface';
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
        message: i18next.t('STATUS.YOU_CAN_NOT_SUBSCRIBE_YOUR_OWN_CHANNEL'),
      };
    }
    const subscribeData = await Subscribe.findOne({ where: { subscribed_user_id: userId } });
    if (subscribeData) {
      return {
        status_code: 400,
        message: i18next.t('STATUS.ALREADY_SUBSCRIBED'),
      };
    }
    const subscribeCreateData = await Subscribe.create({
      subscribed_channel_id: channelData.id,
      subscribe_uuid: generateUUID(),
      subscribed_user_id: userId,
    });
    return {
      status_code: 200,
      message: i18next.t('STATUS.CHANNEL_SUBSCRIBED_SUCCESSFULLY'),
      data: {
        subscibe_id: subscribeCreateData.dataValues.subscribe_uuid,
        channel_id: channel_id,
        user_id: user_uuid,
      },
    };
  },
  removeSubscribe: async (parent: unknown, args: IRemoveSubscribe, context: Icontext) => {
    const { subscribe_id } = args.input;
    const { userId } = context;
    const subscribeData = await Subscribe.findOne({
      where: { subscribe_uuid: subscribe_id, subscribed_user_id: userId },
      raw: true,
      nest: true,
    });
    if (!subscribeData) {
      return {
        message: i18next.t('STATUS.SUBSCRIPTION_NOT_FOUND'),
        status_code: HttpStatus.BAD_REQUEST,
      };
    }
    await Subscribe.destroy({ where: { subscribe_uuid: subscribe_id } });
    return {
      message: i18next.t('STATUS.SUBSCRIPTION_REMOVE_SUCCESSFULLY'),
      status_code: HttpStatus.OK,
      data: {
        subscibe_id: subscribe_id,
      },
    };
  },
};
const subscribeSchemaController = {
  // getSubscribeCount: (parent: unknown, args: IRemoveSubscribe, context: Icontext) => {
  //   console.log('getSubscribeCount');
  // },
};

export { subscribeResolverController, subscribeSchemaController };
