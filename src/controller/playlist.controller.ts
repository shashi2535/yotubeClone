import i18next from 'i18next';
import { Op } from 'sequelize';
import { logger } from '../config';
import { HttpStatus } from '../constant';
import { Icontext, IDeletePlayListAttributes, IPlaylistCreateAttributes } from '../interface';
import { Channel, Playlist } from '../models';
import { generateUUID } from '../utils';
const playlistResolverController = {
  createPlaylist: async (parent: unknown, input: IPlaylistCreateAttributes, context: Icontext) => {
    try {
      const { channel_id, playlist_name } = input.input;
      logger.info('Creating playlist');
      const { userId } = context;
      const channelData = await Channel.findOne({
        where: {
          [Op.and]: [{ user_id: userId }, { chanel_uuid: channel_id }],
        },
        attributes: ['chanel_uuid', 'id'],
        raw: true,
        nest: true,
      });
      if (!channelData) {
        return {
          message: i18next.t('STATUS.CHANNEL_NOT_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
        };
      }
      const playlistData = await Playlist.findOne({
        where: {
          [Op.and]: [
            {
              playlist_name: playlist_name?.trim(),
            },
            {
              channel_id: channelData?.id,
            },
          ],
        },
        raw: true,
        nest: true,
      });
      if (playlistData) {
        return {
          message: i18next.t('STATUS.PLAYLIST_ALREADY_EXIST'),
          status_code: HttpStatus.BAD_REQUEST,
          data: null,
        };
      }
      const playlistCreatedData = await Playlist.create({
        playlist_uuid: generateUUID(),
        channel_id: channelData.id,
        playlist_name,
      });
      return {
        message: i18next.t('STATUS.PLAYLIST_CREATED_SUCCESSFULLY'),
        status_code: HttpStatus.OK,
        data: {
          playlist_uuid: playlistCreatedData.playlist_uuid,
          playlist_name: playlistCreatedData.playlist_name,
        },
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return {
          message: err.message,
          status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  },
  removePlaylist: async (parent: unknown, input: IDeletePlayListAttributes) => {
    try {
      const { playlist_id } = input.input;
      const playlistData = await Playlist.findOne({ where: { playlist_uuid: playlist_id }, raw: true, nest: true });
      if (!playlistData) {
        return {
          message: i18next.t('STATUS.NO_PLAYLIST_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
        };
      }
      await Playlist.destroy({ where: { playlist_uuid: playlist_id } });
      return {
        message: i18next.t('STATUS.PLAYLIST_DELETED_SUCCESSFULLY'),
        status_code: HttpStatus.OK,
      };
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
const playlistQueryController = {
  getPlayListByID: async (parent: unknown, input: IDeletePlayListAttributes) => {
    try {
      const { playlist_id } = input.input;
      const playlistData = await Playlist.findOne({ where: { playlist_uuid: playlist_id }, raw: true, nest: true });
      if (!playlistData) {
        return {
          message: i18next.t('STATUS.NO_PLAYLIST_FOUND'),
          status_code: HttpStatus.BAD_REQUEST,
        };
      }

      return {
        message: i18next.t('STATUS.PLAYLIST_SUCCESSFULLY'),
        status_code: HttpStatus.OK,
        data: {
          playlist_uuid: playlistData.playlist_uuid,
          playlist_name: playlistData.playlist_name,
        },
      };
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

export { playlistResolverController, playlistQueryController };
