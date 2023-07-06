import { Avtar } from './avtar';
import { Channel } from './channel';
import { User } from './user';

export * from './user';
export * from './channel';
export * from './avtar';
User.hasOne(Channel, { foreignKey: 'UserId' });
Channel.hasOne(Avtar, { foreignKey: 'channel_id' });
User.hasOne(Avtar, { foreignKey: 'user_id' });
Channel.belongsTo(User);
Avtar.belongsTo(Channel);
Avtar.belongsTo(User);
