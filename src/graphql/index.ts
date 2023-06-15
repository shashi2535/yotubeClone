import { userSchema, channelSchema } from './schema/';
import { userResolver, ChannelResolver } from './resolver';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
const typedef = mergeTypeDefs([userSchema, channelSchema]);
const resolvers = mergeResolvers([userResolver, ChannelResolver]);
export { resolvers, typedef };
