import { userSchema, channelSchema, subScribeSchema } from './schema/';
import { userResolver, ChannelResolver, subscribeResolver } from './resolver';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import {
  AuthMiddleware,
  loginValidateMiddleware,
  signupValidateMiddleware,
  verifyEmailValidateMiddleware,
  resendCodeOnEmailValidateMiddleware,
  verifyOtpValidateMiddleware,
  imageValidation,
} from './directives/';
const typedef = mergeTypeDefs([userSchema, channelSchema, subScribeSchema]);
const resolvers = mergeResolvers([userResolver, ChannelResolver, subscribeResolver]);
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
};
