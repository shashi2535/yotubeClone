interface signupInput {
  input: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
  };
}

interface verifyOtpInput {
  input: {
    phone: number;
    otp: number;
  };
}

interface resendOtpInput {
  input: {
    user_uuid: string;
  };
}

interface LoginInput {
  input: {
    email: string;
    password: string;
  };
}

interface inputVerificationByCode {
  input: {
    email: string;
    code: string;
  };
}
export { signupInput, verifyOtpInput, resendOtpInput, inputVerificationByCode, LoginInput };
