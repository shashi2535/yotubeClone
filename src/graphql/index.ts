import { userSchema, channelSchema } from './schema/';
import { userResolver, ChannelResolver } from './resolver';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { AuthMiddleware, validationMiddleware } from './directives/auth.directive';
const typedef = mergeTypeDefs([userSchema, channelSchema]);
const resolvers = mergeResolvers([userResolver, ChannelResolver]);
export { resolvers, typedef, AuthMiddleware, validationMiddleware };
