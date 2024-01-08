import S from 'fluent-json-schema';


export interface ILoginRequestSchema {
  Body: {
    email: string;
  };
}

export interface IVerifyRequestSchema {
  Body: {
    email: string;
    oneTimeCode: string;
  };
}

export const loginSchema = {
  body: S.object().prop('email', S.string().required()),
};

export const verifySchema = {
  body: S.object()
    .prop('email', S.string().required())
    .prop('oneTimeCode', S.string().required())
};
