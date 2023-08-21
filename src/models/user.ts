import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { IUserAttributes } from '../interface';
import { Avtar } from './avtar';
import { Channel } from './channel';
import { Comment } from './comment';
import { Like } from './like';
import { Subscribe } from './subscribe';
import { Sub_Comment } from './sub_comment';
import { Video } from './video';

export type UserInput = Optional<IUserAttributes, 'id'>;

class User extends Model {
  public id!: number;
  public user_uuid: string;
  public first_name: string;
  public last_name: string;
  public password: string;
  public email: string;
  public role: string;
  public phone?: string;
  public is_phone_varified: boolean;
  public otp_expiration_time: Date;
  public reset_token: string;
  public otp: number;
  public is_email_varified: boolean;
  public is_blocked: boolean;
  public attempt: number;
  public blocked_at: Date;
  public token_expiration_time: Date | null;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    user_uuid: {
      type: DataTypes.UUID,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    is_phone_varified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otp_expiration_time: {
      type: DataTypes.TIME,
    },
    reset_token: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.INTEGER,
    },
    is_email_varified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    attempt: {
      type: DataTypes.INTEGER,
    },
    blocked_at: {
      type: DataTypes.DATE,
    },
    token_expiration_time: {
      type: DataTypes.DATE,
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
    tableName: 'user',
    modelName: 'User',
  }
);
User.hasOne(Channel, { foreignKey: 'user_id' });
Channel.belongsTo(User), { foreignKey: 'user_id', as: 'User' };

User.hasOne(Avtar, { foreignKey: 'user_id', as: 'User_Avtar' });
Avtar.belongsTo(User, { foreignKey: 'user_id', as: 'User_Avtar' });

User.hasOne(Subscribe, { foreignKey: 'subscribed_user_id', as: 'User_Subscribe' });
Subscribe.belongsTo(User, { foreignKey: 'subscribed_user_id', as: 'User_Subscribe' });

User.hasOne(Video, { foreignKey: 'user_id', as: 'User_Video' });
Video.belongsTo(User, { foreignKey: 'user_id', as: 'User_Video' });

User.hasOne(Like, { foreignKey: 'user_id', as: 'User_Like' });
Like.belongsTo(User, { foreignKey: 'user_id', as: 'User_Like' });

User.hasOne(Comment, { foreignKey: 'user_id', as: 'User_Comment' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'User_Comment' });

User.hasOne(Sub_Comment, { foreignKey: 'user_id', as: 'User_Sub_Comment' });
Sub_Comment.belongsTo(User, { foreignKey: 'user_id', as: 'User_Sub_Comment' });

export { User };
