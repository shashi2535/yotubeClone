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

export { signupInput, verifyOtpInput };
