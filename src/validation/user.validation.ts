import * as yup from 'yup';

// const user_uuid = yup.string().required('user_uuid is required.').min(36).max(36);

const phone = yup
  .string()
  .required('phone is required.')
  .min(5, 'phone should have atleast 5 characters.')
  .max(20, 'phone should have atmost 10 characters.')
  .matches(/^([7-9]{1})([0-9]{9})$/, 'Phone No. Should Be Valid.');
const first_name = yup
  .string()
  .required('First Name is required.')
  .trim()
  .min(3, 'First name should have atleast 3 characters.');
const last_name = yup.string().required('Last name is required.').min(3, 'Last name should have atleast 3 characters.');
const email = yup.string().required('Email is required.').email('This is invalid email.');
const password = yup
  .string()
  .required('Password is required.')
  .min(5, 'Password should have atleast 5 characters.')
  .max(10, 'Password should have atmost 10 characters.');
const otp = yup
  .string()
  .required('otp is required')
  .min(6, 'otp should have atleast 6 characters.')
  .max(6, 'otp should have atleast 6 characters.');
const code = yup.string().required('code is required').min(8, 'code should have atleast 8 characters.');
export const UserRegisterationRules = yup.object().shape({
  password,
  first_name,
  last_name,
  email,
  phone,
});
export const UserLoginRules = yup.object().shape({
  email,
  password,
});

export const verifyEmailRules = yup.object().shape({
  email,
  code,
});

export const resendCodeOnEmailRule = yup.object().shape({
  code,
});

export const verifyOtpRule = yup.object().shape({
  phone,
  otp,
});
