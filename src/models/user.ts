import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { IUserAttributes } from '../interface';
import { Avtar } from './avtar';
import { Channel } from './channel';
import { Subscribe } from './subscribe';

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
User.hasOne(Avtar, { foreignKey: 'user_id' });
User.hasOne(Channel, { foreignKey: 'UserId' });
Avtar.belongsTo(User, { foreignKey: 'user_id', as: 'User' });
Channel.belongsTo(User), { foreignKey: 'UserId', as: 'User' };

User.hasOne(Subscribe, { foreignKey: 'subscribed_user_id', as: 'Subscribe' });
Subscribe.belongsTo(User, { foreignKey: 'subscribed_user_id' });
export { User };
