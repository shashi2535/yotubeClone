import { Avtar } from './avtar';
import { Channel } from './channel';
import { User } from './user';

export * from './user';
export * from './channel';
export * from './avtar';
User.hasOne(Channel, { foreignKey: 'userId' });
Channel.belongsTo(User);
// Channel.hasOne(Channel);
// Avtar.belongsTo(Channel);
