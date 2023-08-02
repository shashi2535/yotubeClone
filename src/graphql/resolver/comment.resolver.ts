import { commentQueryController, commentResolverController } from '../../controller';

export default {
  Query: {
    ...commentQueryController,
  },
  Mutation: {
    ...commentResolverController,
  },
};
