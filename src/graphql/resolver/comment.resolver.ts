import { commentQueryController, commentResolverController } from '../../controller';

export const commentResolver = {
  Query: {
    ...commentQueryController,
  },
  Mutation: {
    ...commentResolverController,
  },
};
