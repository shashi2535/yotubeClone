import { makeExecutableSchema } from '@graphql-tools/schema';
import { typedef, resolvers } from '../graphql';
import {
  AuthMiddleware,
  checkAuthMiddleware,
  createCommentOnVideoValidateMiddleware,
  createLikeOnCommentValidateMiddleware,
  createLikeOnVideoValidateMiddleware,
  deleteCommentOnVideoValidateMiddleware,
  deleteSubCommentOnVideoValidateMiddleware,
  imageValidation,
  loginValidateMiddleware,
  resendCodeOnEmailValidateMiddleware,
  signupValidateMiddleware,
  updateCommentOnVideoValidateMiddleware,
  updateSubCommentOnVideoValidateMiddleware,
  verifiedChannelByAdminValidateMiddleware,
  verifyEmailValidateMiddleware,
  verifyOtpValidateMiddleware,
  videoDeleteValidateMiddleware,
  videoUpdateValidateMiddleware,
  videoValidation,
  createPlaylistValidateMiddleware,
  removePlaylistValidateMiddleware,
} from '../graphql/directives';
let schema = makeExecutableSchema({
  typeDefs: typedef,
  resolvers,
});
// new midleware is priority first for calling
schema = removePlaylistValidateMiddleware(schema, 'removePlaylistValid');
schema = createPlaylistValidateMiddleware(schema, 'createPlaylistValid');
schema = createLikeOnCommentValidateMiddleware(schema, 'createLikeOnCommentValid');
schema = deleteSubCommentOnVideoValidateMiddleware(schema, 'deleteSubCommentValid');
schema = updateSubCommentOnVideoValidateMiddleware(schema, 'updateSubCommentValid');
schema = updateCommentOnVideoValidateMiddleware(schema, 'updateCommentValid');
schema = deleteCommentOnVideoValidateMiddleware(schema, 'deleteCommentValid');
schema = createCommentOnVideoValidateMiddleware(schema, 'createCommentValid');
schema = createLikeOnVideoValidateMiddleware(schema, 'creaeLikeValid');
schema = videoUpdateValidateMiddleware(schema, 'videoUpdateValid');
schema = videoDeleteValidateMiddleware(schema, 'videoDeleteValid');
schema = verifiedChannelByAdminValidateMiddleware(schema, 'verifyChannelValid');
schema = videoValidation(schema, 'videoValid');
schema = checkAuthMiddleware(schema, 'roleCheck');
schema = verifyOtpValidateMiddleware(schema, 'verifyOtpValid');
schema = resendCodeOnEmailValidateMiddleware(schema, 'resendCodeOnEmailValid');
schema = verifyEmailValidateMiddleware(schema, 'verifyEmailValid');
schema = loginValidateMiddleware(schema, 'loginValid');
schema = signupValidateMiddleware(schema, 'signupValid');
schema = imageValidation(schema, 'avtarValid');
schema = AuthMiddleware(schema, 'auth');

export { schema };
