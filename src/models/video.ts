import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { VideoTypes } from '../constant';
import { IVideoAttributes } from '../interface/';
import { Like } from './like';
import { Comment } from './comment';
import { Video_track } from './video_track';
export type videoInput = Optional<IVideoAttributes, 'id'>;

class Video extends Model<IVideoAttributes, videoInput> implements IVideoAttributes {
  public id!: number;
  public video_uuid: string;
  public channel_id: number;
  public user_id: number;
  public video_url: string;
  public description: string;
  public type?: string;
  public title?: string;
  public video_view?: number;
  public public_id?: string;
  public duration?: number;
  public video_position?: number;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Video.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    video_uuid: {
      type: DataTypes.UUID,
    },
    channel_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    video_position: {
      type: DataTypes.INTEGER,
    },
    video_url: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.ENUM(VideoTypes.SHORT, VideoTypes.VIDEO),
      defaultValue: null,
    },
    title: {
      type: DataTypes.STRING,
    },
    public_id: {
      type: DataTypes.STRING,
    },
    video_view: {
      type: DataTypes.INTEGER,
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
    tableName: 'video',
    modelName: 'Video',
  }
);
Video.hasOne(Like, { foreignKey: 'video_id', as: 'Video' });
Like.belongsTo(Video, { foreignKey: 'video_id' });

Video.hasOne(Comment, { foreignKey: 'video_id', as: 'Comment_Video' });
Comment.belongsTo(Video, { foreignKey: 'video_id', as: 'Comment_Video' });

Video.hasOne(Video_track, { foreignKey: 'video_id', as: 'Video_track_Video' });
Video_track.belongsTo(Video, { foreignKey: 'video_id', as: 'Video_track_Video' });

export { Video };
