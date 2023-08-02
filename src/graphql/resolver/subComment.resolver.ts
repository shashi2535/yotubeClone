import { subCommentResolverController, subCommentQueryController } from '../../controller';

export default {
  Query: {
    ...subCommentQueryController,
  },
  Mutation: {
    ...subCommentResolverController,
  },
};
