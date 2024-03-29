import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { Like_types } from '../constant';
import { ILikeAttributes } from '../interface';
export type likeInput = Partial<ILikeAttributes>;

class Like extends Model<ILikeAttributes, likeInput> implements ILikeAttributes {
  public id!: number;
  public video_id: number;
  public user_id: number;
  public comment_id: number;
  public video_uuid?: string;
  public reaction?: string | null;
  public like_uuid?: string | undefined;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Like.init(
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
    user_id: {
      type: DataTypes.INTEGER,
    },
    comment_id: {
      type: DataTypes.INTEGER,
    },
    video_uuid: {
      type: DataTypes.STRING,
    },
    like_uuid: {
      type: DataTypes.UUID,
    },
    reaction: {
      type: DataTypes.ENUM(Like_types.LIKE, Like_types.DISLIKE),
      defaultValue: null,
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
    tableName: 'likes',
    underscored: true,
    modelName: 'Like',
  }
);
export { Like };
