import { userSchema, channelSchema, subScribeSchema, videoSchema, likeSchema, commentSchema } from './schema/';
import {
  userResolver,
  ChannelResolver,
  subscribeResolver,
  VideoResolver,
  likeResolver,
  commentResolver,
} from './resolver';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import {
  AuthMiddleware,
  loginValidateMiddleware,
  signupValidateMiddleware,
  verifyEmailValidateMiddleware,
  resendCodeOnEmailValidateMiddleware,
  verifyOtpValidateMiddleware,
  imageValidation,
  checkAuthMiddleware,
  videoValidation,
  verifiedChannelByAdminValidateMiddleware,
  videoDeleteValidateMiddleware,
  videoUpdateValidateMiddleware,
  createLikeOnVideoValidateMiddleware,
  createCommentOnVideoValidateMiddleware,
  deleteCommentOnVideoValidateMiddleware,
  updateCommentOnVideoValidateMiddleware,
} from './directives/';
const typedef = mergeTypeDefs([userSchema, channelSchema, subScribeSchema, videoSchema, likeSchema, commentSchema]);
const resolvers = mergeResolvers([
  userResolver,
  ChannelResolver,
  subscribeResolver,
  VideoResolver,
  likeResolver,
  commentResolver,
]);
export {
  resolvers,
  typedef,
  AuthMiddleware,
  loginValidateMiddleware,
  signupValidateMiddleware,
  verifyEmailValidateMiddleware,
  resendCodeOnEmailValidateMiddleware,
  verifyOtpValidateMiddleware,
  imageValidation,
  checkAuthMiddleware,
  videoValidation,
  verifiedChannelByAdminValidateMiddleware,
  videoDeleteValidateMiddleware,
  videoUpdateValidateMiddleware,
  createLikeOnVideoValidateMiddleware,
  createCommentOnVideoValidateMiddleware,
  deleteCommentOnVideoValidateMiddleware,
  updateCommentOnVideoValidateMiddleware,
};
