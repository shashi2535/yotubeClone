import { HttpMessage, HttpStatus } from '../constant';
import { resendOtpInput, signupInput, verifyOtpInput } from '../interface';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();
import { User } from '../models';
import { AddMinutesToDate, generateOtp, sendMail, SendOtp } from '../utils';
import { logger } from '../config';

const userResolverController = {
  createUser: async (any: any, input: signupInput) => {
    try {
      const { email, first_name, last_name, password, phone } = input.input;
      const userData = await User.findOne({
        where: {
          email,
        },
      });
      if (userData) {
        return {
          status_code: HttpStatus.BAD_REQUEST,
          message: HttpMessage.USER_EXIST,
        };
      }
      const otpExpirationTime = await AddMinutesToDate(15);
      const randomString = crypto.randomBytes(4).toString('hex');
      const userCreateData = await User.create({
        email,
        first_name,
        last_name,
        password,
        user_uuid: uuidv4(),
        phone,
        otp: generateOtp(),
        otp_expiration_time: otpExpirationTime,
        reset_token: randomString,
        token_expiration_time: await AddMinutesToDate(25),
      });
      await SendOtp(phone, userCreateData.otp);
      await sendMail(email, userCreateData.reset_token);
      return {
        status_code: HttpStatus.OK,
        message: HttpMessage.USER_CREATE_SUCCESSFULLY,
        data: userCreateData.dataValues,
      };
    } catch (err: any) {
      logger.error(JSON.stringify(err));
      return {
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  },
  verifyOtp: async (any: any, input: verifyOtpInput) => {
    const { otp, phone } = input.input;
    const userData = await User.findOne({
      where: {
        phone,
      },
    });
    if (!userData?.dataValues) {
      return {
        message: HttpMessage.SIGNUP_PLEASE,
      };
    }
    if (userData.dataValues.is_blocked === true) {
      logger.info(`${userData.dataValues.is_blocked}`);
      const bolckedTime = userData.dataValues?.blocked_at?.getTime();
      if ((bolckedTime as number) < new Date()?.getTime()) {
        const otpExpirationTime = await AddMinutesToDate(15);
        await User.update(
          {
            is_blocked: false,
            blocked_at: null,
            otp: generateOtp(),
            otp_expiration_time: otpExpirationTime,
            attempt: 0,
          },
          { where: { id: userData.dataValues.id } }
        );
        const updatedUserData = await User.findOne({ where: { id: userData.dataValues.id } });
        await SendOtp(`${updatedUserData?.dataValues.phone}`, updatedUserData?.dataValues.otp as number);
      }
      return {
        message: HttpMessage.ACCOUNT_BLOCKED_FOR_HALF_HOUR,
      };
    }
    if (userData.dataValues.is_phone_varified === true) {
      return {
        message: HttpMessage.ALREADY_VERIFIED,
      };
    }
    const otpExpirationTime = userData?.dataValues?.otp_expiration_time?.getTime();
    if ((otpExpirationTime as number) < new Date()?.getTime()) {
      return {
        message: HttpMessage.OTP_IS_EXPIRED,
      };
    }
    if (Number(otp) !== Number(userData.dataValues.otp)) {
      const count = userData.dataValues.attempt;
      if (count === 3) {
        await User.update(
          { is_blocked: true, blocked_at: await AddMinutesToDate(30) },
          {
            where: {
              id: userData.dataValues.id,
            },
          }
        );
        return {
          message: HttpMessage.ACCOUNT_BLOCKED_FOR_HALF_HOUR,
        };
      }
      await User.update({ attempt: Number(count) + 1 }, { where: { id: userData.dataValues.id } });
      return {
        message: HttpMessage.WRONG_OTP,
      };
    }

    if (Number(otp) === Number(userData.dataValues.otp)) {
      await User.update({ is_phone_varified: true }, { where: { id: userData.dataValues.id } });
      return {
        message: HttpMessage.OTP_VERIFIED_SUCCESSFULLY,
      };
    }
  },
  resendOtp: async (any: any, input: resendOtpInput) => {
    const { user_uuid } = input.input;
    if (!isValidUUID(user_uuid)) {
      return {
        status_code: HttpStatus.BAD_REQUEST,
        message: HttpMessage.INVALID_ID,
      };
    }
    const userData = await User.findOne({ where: { user_uuid } });
    if (!userData?.dataValues) {
      return {
        status_code: HttpStatus.BAD_REQUEST,
        message: HttpMessage.USER_NOT_FOUND,
      };
    }
    if (userData.dataValues.is_phone_varified === true) {
      return {
        status_code: HttpStatus.BAD_REQUEST,
        message: HttpMessage.ALREADY_VERIFIED,
      };
    }
    if (userData.dataValues.is_blocked === true) {
      return {
        status_code: HttpStatus.BAD_REQUEST,
        message: HttpMessage.ACCOUNT_BLOCKED,
      };
    }
    const otpExpirationTime = await AddMinutesToDate(15);
    await User.update(
      {
        otp: generateOtp(),
        otp_expiration_time: otpExpirationTime,
      },
      { where: { user_uuid } }
    );
    const userUpdatedData = await User.findOne({ where: { user_uuid } });
    await SendOtp(`${userUpdatedData?.dataValues.phone}`, userUpdatedData?.dataValues.otp as number);
    return {
      status_code: HttpStatus.OK,
      message: HttpMessage.OK,
    };
  },
  verifyEmailByToken: async (any: any) => {
    logger.info('email verification function');
  },
};

const userQueryController = {
  books: async () => {
    return 'hello ';
  },
  userData: () => {
    const userData = [
      {
        id: 1,
        name: 'user1',
        email: 'user1@yopmail.com',
      },
      {
        id: 2,
        name: 'user2',
        email: 'user2@yopmail.com',
      },
      {
        id: 3,
        name: 'user3',
        email: 'user3@yopmail.com',
      },
      {
        id: 4,
        name: 'user4',
        email: 'user4@yopmail.com',
      },
    ];
    return userData;
  },
};
export { userResolverController, userQueryController };
