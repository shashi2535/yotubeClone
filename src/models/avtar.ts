import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';

interface avtarAttributes {
  id: number;
  image_uuid: string;
  avtar_url: string;
  user_id?: number | null;
  channel_id?: number | null;
  created_at?: Date;
  updated_at?: Date;
}
export type avtarInput = Partial<avtarAttributes>;

class Avtar extends Model<avtarAttributes, avtarInput> implements avtarAttributes {
  public id!: number;
  public image_uuid: string;
  public avtar_url: string;
  public user_id?: number | null;
  public channel_id?: number | null;
  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Avtar.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    image_uuid: {
      type: DataTypes.UUID,
    },
    avtar_url: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    channel_id: {
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
    tableName: 'avtar',
  }
);
export { Avtar };
