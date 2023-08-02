import { userResolverController, userQueryController } from '../../controller';
export default {
  Query: {
    ...userQueryController,
  },
  Mutation: {
    ...userResolverController,
  },
};
