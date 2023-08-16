import { Types } from 'mysql';
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { IvideoTrackAttributes } from '../interface/';
export type videoTrackInput = Optional<IvideoTrackAttributes, 'id'>;

class Video_track extends Model<IvideoTrackAttributes, videoTrackInput> implements IvideoTrackAttributes {
  public id!: number;
  public video_track_uuid: string;
  public user_id?: number;
  public video_id?: number;
  public start_time: number;
  public end_time: number;
  public is_watched?: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Video_track.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    video_track_uuid: {
      type: DataTypes.UUID,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    video_id: {
      type: DataTypes.INTEGER,
    },
    start_time: {
      type: DataTypes.INTEGER,
    },
    end_time: {
      type: DataTypes.INTEGER,
    },
    is_watched: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'video_track',
    modelName: 'Video_track',
  }
);

export { Video_track };
