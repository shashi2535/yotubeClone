import { playlistQueryController, playlistResolverController } from '../../controller';

export default {
  Query: {
    ...playlistQueryController,
  },
  Mutation: {
    ...playlistResolverController,
  },
};
