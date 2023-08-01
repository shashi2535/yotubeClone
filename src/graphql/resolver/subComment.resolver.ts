import { subCommentResolverController, subCommentQueryController } from '../../controller';

export const subCommentResolver = {
  Query: {
    ...subCommentQueryController,
  },
  Mutation: {
    ...subCommentResolverController,
  },
};
