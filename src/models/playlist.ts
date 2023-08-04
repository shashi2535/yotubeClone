import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { IPlaylistAttributes } from '../interface/';

export type playlistInput = Optional<IPlaylistAttributes, 'id'>;

class Playlist extends Model<IPlaylistAttributes, playlistInput> implements IPlaylistAttributes {
  public id!: number;
  public playlist_name: string;
  public channel_id: number;
  public playlist_uuid: string;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;
}

Playlist.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    playlist_name: {
      type: DataTypes.STRING,
    },
    channel_id: {
      type: DataTypes.INTEGER,
    },
    playlist_uuid: {
      type: DataTypes.UUID,
    },
  },
  {
    timestamps: true,
    underscored: false,
    paranoid: true,
    sequelize: sequelizeConnection,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    tableName: 'playlist',
    modelName: 'Playlist',
  }
);

export { Playlist };
