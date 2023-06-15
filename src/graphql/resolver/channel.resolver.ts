import { channelResolverController, channelQueryController } from '../../controller';

export const ChannelResolver = {
  Query: {
    ...channelQueryController,
  },
  Mutation: {
    ...channelResolverController,
  },
};
