import { videoTrackResolverController, videoTrackQueryController } from '../../controller';

export default {
  Query: {
    ...videoTrackQueryController,
  },
  Mutation: {
    ...videoTrackResolverController,
  },
};
