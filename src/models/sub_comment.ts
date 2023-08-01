import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { ISubCommentAttributes } from '../interface';
export type subCommentInput = Partial<ISubCommentAttributes>;

class Sub_Comment extends Model<ISubCommentAttributes, subCommentInput> implements ISubCommentAttributes {
  public id!: number;
  public comment_id: number;
  public sub_comment_uuid: string;
  public sub_comment: string;
  public user_id: number;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}
Sub_Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    comment_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    sub_comment_uuid: {
      type: DataTypes.UUID,
    },
    sub_comment: {
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
    tableName: 'sub_comment',
    modelName: 'Sub_Comment',
  }
);
export { Sub_Comment };
