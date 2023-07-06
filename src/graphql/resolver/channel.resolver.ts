import { logger, pubsub } from '../../config';
import { channelResolverController, channelQueryController } from '../../controller';
import { withFilter } from 'graphql-subscriptions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
export const ChannelResolver = {
  Upload: GraphQLUpload,
  Query: {
    ...channelQueryController,
  },
  Mutation: {
    ...channelResolverController,
  },
  Subscription: {
    createEvent: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('COMMENT_ADDED'),
        (payload, variables) => {
          // Only push an update if the comment is on
          // the correct repository for this operation
          console.log(payload);
          return true;
        }
      ),

      // logger.info('createEvent')
    },
  },
};
