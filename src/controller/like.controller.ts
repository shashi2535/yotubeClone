import { logger } from '../config';
import { Icontext, IlikeCreateReq } from '../interface';

const likeResolverController = {
  createLike: async (parent: unknown, input: IlikeCreateReq, Icontext: Icontext) => {
    logger.info('create like request');
  },
};
const likeQueryController = {};

export { likeResolverController, likeQueryController };
