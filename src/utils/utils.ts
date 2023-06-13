const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const client = require('twilio')(accountSid, authToken);

export const generateOtp = () => 100000 + Math.floor(Math.random() * 900000);

export const SendOtp = async (phone: string, otp: number) => {
    await client.messages.create({
        body: `your otp is ${otp} `,
        from: '+14302434792',
        to: `+91${phone}`,
    });
    return true;
};
export const AddMinutesToDate = async (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
};
