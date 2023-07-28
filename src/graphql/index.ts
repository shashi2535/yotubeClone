import { userSchema, channelSchema, subScribeSchema, videoSchema, likeSchema } from './schema/';
import { userResolver, ChannelResolver, subscribeResolver, VideoResolver, likeResolver } from './resolver';
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
} from './directives/';
const typedef = mergeTypeDefs([userSchema, channelSchema, subScribeSchema, videoSchema, likeSchema]);
const resolvers = mergeResolvers([userResolver, ChannelResolver, subscribeResolver, VideoResolver, likeResolver]);
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
};
