import { channelResolverController, channelQueryController } from '../../controller';
import { GraphQLUpload } from 'graphql-upload-ts';
export const ChannelResolver = {
  // Upload: GraphQLUpload,
  Query: {
    ...channelQueryController,
  },
  Mutation: {
    ...channelResolverController,
  },
};
