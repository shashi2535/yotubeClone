import { logger, pubsub } from '../../config';
import { subscribeResolverController, subscribeSchemaController } from '../../controller';
import { withFilter } from 'graphql-subscriptions';

export const subscribeResolver = {
  Query: {
    ...subscribeSchemaController,
  },
  Mutation: {
    ...subscribeResolverController,
  },
};
