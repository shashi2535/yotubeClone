import { videoQueryController, videoResolverController } from '../../controller';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
export default {
  Upload: GraphQLUpload,
  Query: {
    ...videoQueryController,
  },
  Mutation: {
    ...videoResolverController,
  },
};
