import { userResolverController, userQueryController } from '../../controller';
export const userResolver = {
  Query: {
    ...userQueryController,
  },
  Mutation: {
    ...userResolverController,
  },
};
