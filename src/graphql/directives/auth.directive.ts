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
} from '../../validation';
import { IloginInput, IsignupInput, IinputVerificationByCode, IverifyOtpInput } from '../../interface';
import i18next from 'i18next';

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

export {
  AuthMiddleware,
  loginValidateMiddleware,
  signupValidateMiddleware,
  verifyEmailValidateMiddleware,
  resendCodeOnEmailValidateMiddleware,
  verifyOtpValidateMiddleware,
  imageValidation,
};
