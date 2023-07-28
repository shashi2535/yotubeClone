import nodemailer from 'nodemailer';
import { logger } from '../config';
import { config } from '../config/credential.env';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';
import { tmpdir } from 'os';
import { createWriteStream } from 'fs';
export const generateOtp = () => 100000 + Math.floor(Math.random() * 900000);
const {
  TWILLIO: { ACCOUNT_SID, AUTH_TOKEN, TWILLIO_PHONE_NUMBER },
  EMAIL: { EMAIL_PASSWORD, EMAIL_SERVICE, EMAIL_USERNAME },
  CLOUDINARY: { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME },
} = config;
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
export const SendOtp = async (phone: string, otp: number) => {
  await client.messages.create({
    body: `your otp is ${otp} `,
    from: `${TWILLIO_PHONE_NUMBER}`,
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
    service: EMAIL_SERVICE,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
  });
  const mailDetails = {
    from: EMAIL_USERNAME,
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
  const data = await cloudinary.uploader.upload(`${path}`, {
    folder: 'channelAvtar',
  });
  return data;
};

export const picUpdatedInCloudinary = async (public_id: string, path: string) => {
  // v2.uploader.destroy(public_id);
  await cloudinary.uploader.destroy(public_id);
  const data = await cloudinary.uploader.upload(`${path}`, {
    folder: 'channelAvtar',
  });
  return data;
};
export const videoStoreInTmpFolder = async (upload: any) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const id = Date.now();
  const path = `${tmpdir()}/${id}.mp4`;
  const file = new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ path, filename, mimetype }))
      .on('error', reject)
  );
  return file;
};

export const videoUploadInCloudinary = async (path: string) => {
  const data = await cloudinary.uploader.upload(`${path}`, {
    folder: 'videos',
    resource_type: 'video',
  });
  return data;
};
