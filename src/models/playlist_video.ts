import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { IPlaylistVideoAttributes } from '../interface';
export type PlaylistVideoInput = Partial<IPlaylistVideoAttributes>;

class PlaylistVideo extends Model<IPlaylistVideoAttributes, PlaylistVideoInput> implements IPlaylistVideoAttributes {
  public id!: number;
  public video_id: number;
  public playlist_id: number;
  public playlist_video_uuid: string;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

PlaylistVideo.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    video_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    playlist_id: {
      type: DataTypes.INTEGER,
    },
    playlist_video_uuid: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'created_at',
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      field: 'updated_at',
    },
  },
  {
    timestamps: false,
    sequelize: sequelizeConnection,
    paranoid: true,
    tableName: 'PlaylistVideo',
    underscored: true,
    modelName: 'playlist_video',
  }
);
export { PlaylistVideo };
