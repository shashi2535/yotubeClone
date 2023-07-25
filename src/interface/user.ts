interface IsignupInput {
  input: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
  };
}

interface IverifyOtpInput {
  input: {
    phone: number;
    otp: number;
  };
}

interface IresendOtpInput {
  input: {
    user_uuid: string;
  };
}

interface IloginInput {
  input: {
    email: string;
    password: string;
  };
}

interface IinputVerificationByCode {
  input: {
    email: string;
    code: string;
  };
}
interface IUserAttributes {
  id: number;
  user_uuid?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  email?: string;
  role?: string;
  phone?: string;
  is_phone_varified?: boolean;
  otp_expiration_time?: Date | null;
  reset_token?: string;
  otp?: number | null;
  is_email_varified?: boolean;
  attempt?: number;
  is_blocked?: boolean;
  blocked_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
  token_expiration_time: Date | null;
}
export { IsignupInput, IverifyOtpInput, IresendOtpInput, IinputVerificationByCode, IloginInput, IUserAttributes };
