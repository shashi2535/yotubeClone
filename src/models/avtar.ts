import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';

interface avtarAttributes {
  id: number;
  image_uuid: string;
  avtar_url: string;
  foriegn_id: number;
  type: string;
  created_at?: Date;
  updated_at?: Date;
}
export type avtarInput = Optional<avtarAttributes, 'id'>;

class Avtar extends Model<avtarAttributes, avtarInput> implements avtarAttributes {
  public id!: number;
  public image_uuid: string;
  public avtar_url: string;
  public foriegn_id: number;
  public type: string;
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
    foriegn_id: {
      type: DataTypes.INTEGER,
    },
    type: {
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
    tableName: 'avtar',
  }
);
export { Avtar };
