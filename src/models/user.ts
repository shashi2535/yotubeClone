import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelizeConnection } from '../config';

interface UserAttributes {
    id: number;
    user_uuid?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    email?: string;
    role?: string;
    phone?: string;
    is_phone_varified?: boolean;
    otp_expiration_time?: Date;
    reset_token?: string;
    otp?: number;
    is_email_varified?: boolean;
    attempt?: number;
    is_blocked?: boolean;
    blocked_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}
export type UserInput = Optional<UserAttributes, 'id'>;

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
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
    }
);

export { User };
