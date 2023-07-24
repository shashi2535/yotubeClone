import { AuthenticationError } from 'apollo-server-errors';
import { Request } from 'express';
import i18next from 'i18next';
import { JsonWebTokenError, JwtPayload, verify } from 'jsonwebtoken';
import { config, logger } from '../config';
import { Locale } from '../constant';
import { User } from '../models';

const { JWT_SECRET } = config.JWT;
export const verifyJwt = async (req: Request) => {
  try {
    // if (req.rawHeaders[15].includes('application/json') === false) {
    if (req.rawHeaders.includes('token')) {
      //   const token: any = req?.headers?.token;
      const token = req.rawHeaders.includes('locale') ? req.rawHeaders[33] : req.rawHeaders[31];
      const lan = req.rawHeaders[25] === Locale.HI ? Locale.HI : Locale.EN;
      i18next.changeLanguage(lan);
      if (token) {
        const payload = (await verify(token, JWT_SECRET)) as JwtPayload;
        const userData = await User.findOne({ where: { user_uuid: payload.id }, raw: true, nest: true });
        if (!userData) {
          throw new AuthenticationError(i18next.t('STATUS.USER_NOT_FOUND'));
        }
        return {
          userId: userData.id,
          user_uuid: userData.user_uuid,
        };
      }
    }
  } catch (err: unknown) {
    logger.error(JSON.stringify(err));
    if (err instanceof JsonWebTokenError) {
      throw new AuthenticationError(err.message);
    }
  }
};
