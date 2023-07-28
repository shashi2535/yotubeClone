import { likeQueryController, likeResolverController } from '../../controller';

export const likeResolver = {
  Query: {
    ...likeQueryController,
  },
  Mutation: {
    ...likeResolverController,
  },
};
