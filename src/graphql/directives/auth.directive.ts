import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { HttpStatus, MIME_TYPE } from '../../constant';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { logger } from '../../config';
import {
  UserLoginRules,
  UserRegisterationRules,
  verifyEmailRules,
  resendCodeOnEmailRule,
  verifyOtpRule,
  verifiedChannelByAdminRule,
  verifiedCreateVideoRule,
  videoUpdateRule,
  updateVideoRule,
  likeCreateOnVideoRule,
  commentCreateOnVideoRule,
  commentDeleteOnVideoRule,
  commentUpdateOnVideoRule,
  subCommentUpdateOnVideoRule,
  subCommentdeleteOnVideoRule,
  likeCreateOnCommentRule,
  createPlaylistRule,
  removePlaylistRule,
  createVideoTrackRule,
  getVideoRule,
  createChannelRule,
  nextPrevVideoRule,
} from '../../validation';
import {
  IloginInput,
  IsignupInput,
  IinputVerificationByCode,
  IverifyOtpInput,
  Icontext,
  ICreateVideo,
  IUpdateVideo,
  IlikeCreateReq,
  IcommentCreateAttributes,
  IcommentDeleteAttributes,
  IcommentUpdateAttributes,
  IUpdateSubComment,
  IDeleteSubComment,
  ILikeOnComment,
  IPlaylistCreateAttributes,
  IDeletePlayListAttributes,
  IcreateVideoTrack,
  IGetVideo,
  IverifiedChannelByAdmin,
  IdeleteVideo,
  ICreateChannelReq,
  INextPreviousVideo,
} from '../../interface';
import i18next from 'i18next';
import { validateUUID } from '../../utils';

const AuthMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source: unknown, args: unknown, context: any, info: unknown) {
          logger.info(`authmidleware >>> ${JSON.stringify(context)}`);
          if (Object.keys(context).length === 0) {
            return {
              status_code: HttpStatus.BAD_REQUEST,
              message: i18next.t('STATUS.TOKEN_REQUIRED'),
            };
          }
          return await resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
};
const imageValidation = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source: unknown, args: ICreateChannelReq, context: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const file = await args?.profile_picture;
          if (file) {
            if (file.mimetype !== MIME_TYPE.FOR_IMAGE) {
              return {
                status_code: HttpStatus.BAD_REQUEST,
                message: i18next.t('STATUS.ONLY_IMAGE_ALLOW'),
              };
            }
          }
          await createChannelRule.validate(args.input);
          return await resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
};
const loginValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IloginInput, context: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          logger.info(`input in login validation>>> ${JSON.stringify(args)}`);
          await UserLoginRules.validate(args.input, { abortEarly: false });
          const result = await resolve(source, args, context, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const signupValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IsignupInput, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          logger.info(`input in signup validation>>> ${JSON.stringify(args)}`);
          await UserRegisterationRules.validate(args.input);
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const verifyEmailValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: unknown,
          args: IinputVerificationByCode,
          Icontext: any,
          info: unknown
        ) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          logger.info(`input in signup validation>>> ${JSON.stringify(args)}`);
          await verifyEmailRules.validate(args.input);
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const resendCodeOnEmailValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: any, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          logger.info(`input in resendCodeOnEmail validation>>> ${JSON.stringify(args)}`);
          await resendCodeOnEmailRule.validate(args.input);
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const verifyOtpValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IverifyOtpInput, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          logger.info(`input in resendCodeOnEmail validation>>> ${JSON.stringify(args)}`);
          await verifyOtpRule.validate(args.input);
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const checkAuthMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source: unknown, args: unknown, context: Icontext, info: unknown) {
          logger.info(`check role >>> ${JSON.stringify(context)}`);
          if (context.role !== '1') {
            return {
              status_code: HttpStatus.UNAUTHORIZED,
              message: i18next.t('STATUS.UNABLE_TO_ACCESS'),
            };
          }
          return await resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
};
const videoValidation = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source: unknown, args: ICreateVideo, context: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const file = await args?.video_url;
          const { description, title } = args.input;
          await verifiedCreateVideoRule.validate({ description, title });
          if (file) {
            if (file?.mimetype !== MIME_TYPE.FOR_VIDEO) {
              return {
                status_code: HttpStatus.BAD_REQUEST,
                message: i18next.t('STATUS.ONLY_VIDEO_ALLOWED'),
              };
            }
          }
          return await resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
};
const verifiedChannelByAdminValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: unknown,
          args: IverifiedChannelByAdmin,
          Icontext: any,
          info: unknown
        ) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          logger.info(`input in verifiedChannelByAdminValidateMiddleware validation>>> ${JSON.stringify(args.input)}`);
          await verifiedChannelByAdminRule.validate(args.input);
          if (!validateUUID(args.input.channel_id)) {
            return {
              message: i18next.t('STATUS.IVALID_CHANNEL_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const videoDeleteValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IdeleteVideo, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          logger.info(`input in videoDeleteValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await videoUpdateRule.validate(args.input);
          if (!validateUUID(args.input.video_id)) {
            return {
              message: i18next.t('STATUS.INVALID_VIDEO_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const videoUpdateValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IUpdateVideo, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { description, title, video_id } = args.input;
          logger.info(`input in videoUpdateValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await updateVideoRule.validate({ description, title, video_id });
          if (!validateUUID(video_id)) {
            return {
              message: i18next.t('STATUS.INVALID_VIDEO_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const createLikeOnVideoValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IlikeCreateReq, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { type, video_id } = args.input;
          logger.info(`input in createLikeOnVideoValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await likeCreateOnVideoRule.validate({ type, video_id });
          if (!validateUUID(video_id)) {
            return {
              message: i18next.t('STATUS.INVALID_VIDEO_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const createCommentOnVideoValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: unknown,
          args: IcommentCreateAttributes,
          Icontext: any,
          info: unknown
        ) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { comment, video_id } = args.input;
          logger.info(`input in createCommentOnVideoValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await commentCreateOnVideoRule.validate({ comment, video_id });
          if (!validateUUID(video_id)) {
            return {
              message: i18next.t('STATUS.INVALID_VIDEO_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const deleteCommentOnVideoValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: unknown,
          args: IcommentDeleteAttributes,
          Icontext: any,
          info: unknown
        ) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { comment_id } = args.input;
          logger.info(`input in deleteCommentOnVideoValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await commentDeleteOnVideoRule.validate({ comment_id });
          if (!validateUUID(comment_id)) {
            return {
              message: i18next.t('STATUS.INVALID_COMMENT_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const updateCommentOnVideoValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: unknown,
          args: IcommentUpdateAttributes,
          Icontext: any,
          info: unknown
        ) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { comment_id, comment } = args.input;
          logger.info(`input in updateCommentOnVideoValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await commentUpdateOnVideoRule.validate({ comment_id, comment });
          if (!validateUUID(comment_id)) {
            return {
              message: i18next.t('STATUS.INVALID_COMMENT_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const updateSubCommentOnVideoValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IUpdateSubComment, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { sub_comment_id, comment } = args.input;
          logger.info(`input in updateSubCommentOnVideoValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await subCommentUpdateOnVideoRule.validate({ sub_comment_id, comment });
          if (!validateUUID(sub_comment_id)) {
            return {
              message: i18next.t('STATUS.INVALID_SUB_COMMENT_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const deleteSubCommentOnVideoValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IDeleteSubComment, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { sub_comment_id } = args.input;
          logger.info(`input in deleteSubCommentOnVideoValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await subCommentdeleteOnVideoRule.validate({ sub_comment_id });
          if (!validateUUID(sub_comment_id)) {
            return {
              message: i18next.t('STATUS.INVALID_SUB_COMMENT_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const createLikeOnCommentValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: ILikeOnComment, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { type, comment_id } = args.input;
          logger.info(`input in createLikeOnVideoValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await likeCreateOnCommentRule.validate({ type, comment_id });
          if (!validateUUID(comment_id)) {
            return {
              message: i18next.t('STATUS.INVALID_COMMENT_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const createPlaylistValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: unknown,
          args: IPlaylistCreateAttributes,
          Icontext: any,
          info: unknown
        ) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { channel_id, playlist_name } = args.input;
          logger.info(`input in createPlaylistValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await createPlaylistRule.validate({ channel_id, playlist_name });
          if (!validateUUID(channel_id)) {
            return {
              message: i18next.t('STATUS.IVALID_CHANNEL_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const removePlaylistValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: unknown,
          args: IDeletePlayListAttributes,
          Icontext: any,
          info: unknown
        ) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { playlist_id } = args.input;
          logger.info(`input in createPlaylistValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await removePlaylistRule.validate({ playlist_id });
          if (!validateUUID(playlist_id)) {
            return {
              message: i18next.t('STATUS.INVALID_PLAYLIST_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const videoTrackValidationMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IcreateVideoTrack, Icontext: any, info: unknown) {
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const { duration, video_id } = args.input;
          logger.info(`input in videoTrackValidationMiddleware validation>>> ${JSON.stringify(args)}`);
          await createVideoTrackRule.validate({ video_id, duration });
          if (!validateUUID(String(video_id))) {
            return {
              message: i18next.t('STATUS.INVALID_VIDEO_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};

const getVideoValidationMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IGetVideo, Icontext: any, info: unknown) {
          logger.info(`input in getVideoValidationMiddleware validation>>> ${JSON.stringify(args)}`);
          // const arr = ['sort'];
          // for (const ele in args.input) {
          //   if (!arr.includes(ele)) {
          //     return {
          //       message: `${ele} Is Not Allowed.`,
          //       status_code: HttpStatus.BAD_REQUEST,
          //     };
          //   }
          // }
          await getVideoRule.validate(args.input, { abortEarly: false });
          if (args?.input?.video_uuid) {
            if (!validateUUID(String(args.input.video_uuid))) {
              return {
                message: i18next.t('STATUS.INVALID_VIDEO_ID'),
                status_code: HttpStatus.BAD_REQUEST,
              };
            }
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
const nextPreviousVideoValidationMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: INextPreviousVideo, Icontext: any, info: unknown) {
          logger.info(`input in nextPreviousVideoValidationMiddleware validation>>> ${JSON.stringify(args)}`);
          if (Object.keys(args).length === 0) {
            return {
              message: i18next.t('STATUS.INVALID_INPUT'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          await nextPrevVideoRule.validate(args.input, { abortEarly: false });
          if (!validateUUID(String(args.input.video_id))) {
            return {
              message: i18next.t('STATUS.INVALID_VIDEO_ID'),
              status_code: HttpStatus.BAD_REQUEST,
            };
          }
          const result = await resolve(source, args, Icontext, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
export {
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
  updateSubCommentOnVideoValidateMiddleware,
  deleteSubCommentOnVideoValidateMiddleware,
  createLikeOnCommentValidateMiddleware,
  createPlaylistValidateMiddleware,
  removePlaylistValidateMiddleware,
  videoTrackValidationMiddleware,
  getVideoValidationMiddleware,
  nextPreviousVideoValidationMiddleware,
};
