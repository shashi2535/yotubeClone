import { userResolver } from './userResolver';
import merge from 'lodash/merge';
const resolvers = merge(userResolver);
export { resolvers };
