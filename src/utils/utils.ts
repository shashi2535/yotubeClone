const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('twilio')(accountSid, authToken);
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from '../config';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';
export const generateOtp = () => 100000 + Math.floor(Math.random() * 900000);

export const SendOtp = async (phone: string, otp: number) => {
  await client.messages.create({
    body: `your otp is ${otp} `,
    from: '+14302434792',
    to: `+91${phone}`,
  });
  return true;
};
export const AddMinutesToDate = async (minutes: number) => {
  const date = new Date();
  return new Date(date.getTime() + minutes * 60000);
};
export const sendMail = async (email: string, code: string) => {
  const mailTransporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_PASSWORD,
    },
  });
  const mailDetails = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: 'Please Verify Your Email',
    text: `Your code is ${code} please Verify. It Will Be Expire In 25 Minutes.`,
  };
  await mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      logger.error('error occurred in node mailer');
    } else {
      logger.info('mail send succesfully.');
    }
  });
};
export const GenerateCodeForEmail = async () => {
  const randomString = await crypto.randomBytes(4).toString('hex');
  return randomString;
};
export const generateUUID = () => uuidv4();
export const validateUUID = (uuid: string) => {
  if (!isValidUUID(uuid)) {
    return false;
  } else {
    return true;
  }
};
export const picUploadInCloudinary = async (path: string) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  const data = await cloudinary.uploader.upload(`${path}`, {
    folder: 'channelAvtar',
  });
  return data;
};

export const picUpdatedInCloudinary = async (public_id: string, path: string) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
  // v2.uploader.destroy(public_id);
  await cloudinary.uploader.destroy(public_id);
  const data = await cloudinary.uploader.upload(`${path}`, {
    folder: 'channelAvtar',
  });
  return data;
};
