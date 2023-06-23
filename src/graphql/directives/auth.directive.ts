import { defaultFieldResolver, GraphQLSchema, DirectiveLocation } from 'graphql';
import { HttpMessage } from '../../constant';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { logger } from '../../config';
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
          logger.info('authmidleware');
          if (Object.keys(context).length === 0) {
            return {
              status_code: 400,
              message: HttpMessage.TOKEN_REQUIRED,
            };
          }
          const result = await resolve(source, args, context, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};

const validationMiddleware = (schema: GraphQLSchema, directiveName: any) => {
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
          //   if (Object.keys(context).length === 0) {
          //     logger.info('authmidleware');
          //     return {
          //       status_code: 400,
          //       message: HttpMessage.TOKEN_REQUIRED,
          //     };
          //   }
          logger.info('validationMiddleware');
          const result = await resolve(source, args, context, info);
          return result;
        };
        return fieldConfig;
      }
    },
  });
};
export { AuthMiddleware, validationMiddleware };
// export default AuthMiddleware;
