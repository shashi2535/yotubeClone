import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { ISubscribeAttributes } from '../interface/';

export type subscribeInput = Optional<ISubscribeAttributes, 'id'>;

class Subscribe extends Model<ISubscribeAttributes, subscribeInput> implements ISubscribeAttributes {
  public id!: number;
  public subscribe_uuid: string;
  public subscribed_channel_id: number;
  public subscribed_user_id: number;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Subscribe.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    subscribe_uuid: {
      type: DataTypes.UUID,
    },
    subscribed_channel_id: {
      type: DataTypes.INTEGER,
    },
    subscribed_user_id: {
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
    tableName: 'subscribe',
    modelName: 'Subscribe',
  }
);
// Channel.hasOne(Avtar, { foreignKey: 'channel_id', as: 'Avtar' });
// Avtar.belongsTo(Channel, { foreignKey: 'channel_id' });
// Avtar.belongsTo(User);

export { Subscribe };
