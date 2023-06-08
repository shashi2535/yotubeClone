import { userSchema } from './schema/';
import { userResolver } from './resolver';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
const typedefs = mergeTypeDefs([userSchema]);
const resolvers = mergeResolvers([userResolver]);
export { resolvers, typedefs };
