import i18next from 'i18next';
import { fn, col, Op } from 'sequelize';
import { HttpStatus } from '../constant';
import { IchannelAttributes, Icontext, IcreateSubscribe, IRemoveSubscribe, ISubscribeAttributes } from '../interface';
import { Avtar, Channel, Subscribe, User } from '../models';
import { generateUUID } from '../utils';

const subscribeResolverController = {
  createSubscribe: async (parent: unknown, args: IcreateSubscribe, context: Icontext) => {
    try {
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
        attributes: { exclude: ['UserId'] },
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
        subscribed_channel_uuid: channelData.chanel_uuid,
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
  removeSubscribe: async (parent: unknown, args: IRemoveSubscribe, context: Icontext) => {
    try {
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
const subscribeSchemaController = {
  getSubscribedChannelByAdmin: async (parent: unknown, args: IRemoveSubscribe, context: Icontext) => {
    try {
      const subscribeData: ISubscribeAttributes[] = await Subscribe.findAll({
        raw: true,
        nest: true,
        attributes: [
          'subscribed_channel_id',
          [fn('count', col('subscribed_channel_id')), 'subscribed_channel_id_count'],
        ],
        include: [
          {
            model: Channel,
            as: 'Channel',
            where: { is_verified: false },
            attributes: ['chanel_uuid', 'channel_name', 'handle', 'is_verified'],
            include: [
              {
                model: Avtar,
                as: 'Avtar',
                attributes: ['image_uuid', 'avtar_url'],
              },
            ],
          },
        ],
        having: {
          subscribed_channel_id_count: {
            [Op.gt]: 0,
          },
        },
      });
      if (subscribeData.length == 0) {
        return {
          status_code: HttpStatus.BAD_REQUEST,
          message: i18next.t('STATUS.SUBSCRIPTION_NOT_FOUND'),
          data: [],
        };
      }

      return {
        status_code: HttpStatus.OK,
        message: i18next.t('STATUS.SUBSCRIPTION_LIST_SUCCESSFULLY'),
        data: subscribeData,
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

export { subscribeResolverController, subscribeSchemaController };
