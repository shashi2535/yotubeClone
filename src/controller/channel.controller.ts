import { logger } from '../config';
import { HttpMessage } from '../constant';
import { context } from '../interface/channel';

const channelResolverController = {
  createChannel: async (any: any, input: any, context: context) => {
    if (Object.keys(context).length === 0) {
      return {
        status_code: 400,
        message: HttpMessage.TOKEN_REQUIRED,
      };
    }
    const { userId } = context;
    logger.info(`${userId}`);
  },
};

const channelQueryController = {};

export { channelQueryController, channelResolverController };
