import { likeQueryController, likeResolverController } from '../../controller';

export default {
  Query: {
    ...likeQueryController,
  },
  Mutation: {
    ...likeResolverController,
  },
};
