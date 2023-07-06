import { channelResolverController, channelQueryController } from '../../controller';
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
};
