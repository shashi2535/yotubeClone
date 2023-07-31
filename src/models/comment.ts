import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { ICommentAttributes } from '../interface';
export type commentInput = Partial<ICommentAttributes>;

class Comment extends Model<ICommentAttributes, commentInput> implements ICommentAttributes {
  public id!: number;
  public comment_uuid: string;
  public video_id: number;
  public user_id?: number | null;
  public video_uuid?: string | null;
  public text?: string | undefined;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    video_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    video_uuid: {
      type: DataTypes.STRING,
    },
    comment_uuid: {
      type: DataTypes.UUID,
    },
    text: {
      type: DataTypes.STRING,
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
    tableName: 'comment',
    modelName: 'Comment',
  }
);
export { Comment };
