import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';

interface channelAttributes {
  id: number;
  chanel_uuid?: string;
  UserId?: number;
  channel_name?: string;
  handle?: string;
  discription?: string;
  avatar?: string;
  created_at?: Date;
  updated_at?: Date;
}
export type UserInput = Optional<channelAttributes, 'id'>;

class User extends Model<channelAttributes, UserInput> implements channelAttributes {
  public id!: number;
  public chanel_uuid: string;
  public UserId: number;
  public channel_name: string;
  public handle: string;
  public discription: string;
  public avatar: string;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  static associate(models: any) {
    // define association here
    this.belongsTo(models.user, {
      foreignKey: 'UserId',
      as: 'user',
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    chanel_uuid: {
      type: DataTypes.UUID,
    },
    channel_name: {
      type: DataTypes.STRING,
    },
    handle: {
      type: DataTypes.STRING,
    },
    discription: {
      type: DataTypes.STRING,
    },
    avatar: {
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
    tableName: 'channel',
  }
);

export { User };
