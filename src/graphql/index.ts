import { userSchema, channelSchema, subScribeSchema, videoSchema } from './schema/';
import { userResolver, ChannelResolver, subscribeResolver, VideoResolver } from './resolver';
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
} from './directives/';
const typedef = mergeTypeDefs([userSchema, channelSchema, subScribeSchema, videoSchema]);
const resolvers = mergeResolvers([userResolver, ChannelResolver, subscribeResolver, VideoResolver]);
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
};
