import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';
import { IAvtarAttributes } from '../interface/avtar';
export type avtarInput = Partial<IAvtarAttributes>;

class Avtar extends Model<IAvtarAttributes, avtarInput> implements IAvtarAttributes {
  public id!: number;
  public image_uuid: string;
  public avtar_url: string;
  public user_id?: number | null;
  public public_id?: string | undefined;
  // public channel_id?: ForeignKey<Channel['id']>;
  public channel_id: number | null;
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
    public_id: {
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
    modelName: 'Avtar',
  }
);
export { Avtar };
