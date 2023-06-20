import { Channel } from './channel';
import { User } from './user';

export * from './user';
export * from './channel';
User.hasOne(Channel, { foreignKey: 'userId' });
Channel.belongsTo(User);
