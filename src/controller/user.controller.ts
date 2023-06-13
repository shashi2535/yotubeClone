import { HttpMessage, HttpStatus } from '../constant';
import { signupInput, verifyOtpInput } from '../interface';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();
import { User } from '../models';
import { AddMinutesToDate, generateOtp, SendOtp } from '../utils';

const userResolverController = {
    createUser: async (any: any, input: signupInput) => {
        try {
            const { email, first_name, last_name, password, phone } =
                input.input;
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
            const date = new Date();
            const otpExpirationTime = await AddMinutesToDate(date, 15);
            const userCreateData = await User.create({
                email,
                first_name,
                last_name,
                password,
                user_uuid: uuidv4(),
                phone,
                otp: generateOtp(),
                otp_expiration_time: otpExpirationTime,
            });
            await SendOtp(phone, userCreateData.otp);
            return {
                status_code: HttpStatus.OK,
                message: HttpMessage.USER_CREATE_SUCCESSFULLY,
                data: userCreateData,
            };
        } catch (err: any) {
            console.log('err>>>>>', err);
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
                message: 'Please Signup.',
            };
        }
        if (userData.dataValues.is_phone_varified === true) {
            return {
                message: 'Already Verified Please Login.',
            };
        }
        const otpExpirationTime =
            userData?.dataValues?.otp_expiration_time?.getTime();
        if ((otpExpirationTime as number) < new Date()?.getTime()) {
            return {
                message: 'Your Otp Is Expired.',
            };
        }
        if (Number(otp) !== Number(userData.dataValues.otp)) {
            console.log('>>>>');
            const count = userData.dataValues.attempt;
            // if (!count) {
            // }
            console.log({ count });
        }

        if (Number(otp) === Number(userData.dataValues.otp)) {
            const updatedvalue = await User.update(
                { is_phone_varified: true },
                { where: { id: userData.dataValues.id } }
            );
            console.log('updatedvalue', updatedvalue);
            return {
                message: 'Your Otp Is Verified successfully.',
            };
        }

        return {
            message: 'Ok',
        };
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
