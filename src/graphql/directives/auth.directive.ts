import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { HttpStatus } from '../../constant';
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
} from '../../validation';
import {
  IloginInput,
  IsignupInput,
  IinputVerificationByCode,
  IverifyOtpInput,
  Icontext,
  ICreateVideo,
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
        fieldConfig.resolve = async function (source: unknown, args: any, context: any, info: unknown) {
          const file = await args?.profile_picture;
          // logger.info('image validation', JSON.stringify(file));
          if (file) {
            if (file.mimetype !== 'image/png') {
              return {
                status_code: HttpStatus.BAD_REQUEST,
                message: i18next.t('STATUS.ONLY_IMAGE_ALLOW'),
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
const loginValidateMiddleware = (schema: GraphQLSchema, directiveName: any) => {
  return mapSchema(schema, {
    // Executes once for each object field definition in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig: any) => {
      const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0];
      if (deprecatedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (source: unknown, args: IloginInput, context: any, info: unknown) {
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
          const file = await args?.video_url;
          const { description, title } = args.input;
          await verifiedCreateVideoRule.validate({ description, title });
          if (file) {
            if (file?.mimetype !== 'video/mp4') {
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
        fieldConfig.resolve = async function (source: unknown, args: any, Icontext: any, info: unknown) {
          logger.info(`input in verifiedChannelByAdminValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await verifiedChannelByAdminRule.validate(args);
          if (!validateUUID(args.channel_id)) {
            return {
              message: 'Invalid Channel Id.',
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
        fieldConfig.resolve = async function (source: unknown, args: any, Icontext: any, info: unknown) {
          logger.info(`input in videoDeleteValidateMiddleware validation>>> ${JSON.stringify(args)}`);
          await videoUpdateRule.validate(args);
          if (!validateUUID(args.video_id)) {
            return {
              message: 'Invalid video_id.',
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
};
