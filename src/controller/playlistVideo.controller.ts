import { logger } from '../config';
import { HttpStatus } from '../constant';

const playlistVideoResolverController = {
  createVideoInPlaylist: async () => {
    try {
      logger.info('create video in playlist controller');
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
};
const playlistVideoQueryController = {};

export { playlistVideoResolverController, playlistVideoQueryController };
