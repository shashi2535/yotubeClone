import { mergeAllResolver, mergeAllTypes } from '../utils';
// typedef and resolver
const typedef = mergeAllTypes();
const resolvers = mergeAllResolver();
export { typedef, resolvers };
