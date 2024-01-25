import { injectable } from "inversify";
import { IBodyRequestService } from "../../domain/request/services/body-request-service";
import { ILoginRequestAuthDTO } from "../dtos/auth/login-auth-dto";
import { createPerson, getPersonByEmail } from "../../persons";
import { createOneTimeCode } from "../../one-time-code";
import nodemailer from 'nodemailer';
import { Settings } from "../../../config/settings";
import { IResponseService } from "../../domain/response/services/response-service";

export interface IAuthController {
  login(request: IBodyRequestService<ILoginRequestAuthDTO>, reply: IResponseService): void;
}

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.ru',
  port: 465,
  secure: true,
  auth: {
    user: Settings.getMailUser(),
    pass: Settings.getMailPassword()
  }
});

@injectable()
export class AuthController implements IAuthController {  
  async login(request: IBodyRequestService<ILoginRequestAuthDTO>, reply: IResponseService) {
    try {
      const { email } = request.getBody();

      const person = await getPersonByEmail(email);
      const isPersonFound = person !== undefined;

      let personId = null;
      
      if (!isPersonFound) {
        const [ newPerson ] = await createPerson(email);
        personId = newPerson;
      } else {
        personId = person.id;
      }
      
      if (personId !== null) {
        const oneTimeCode = this.generateOneTimeCode();
        await createOneTimeCode(personId, oneTimeCode, new Date(Date.now() + 60_000 * 60));
      
        transporter.sendMail({
          from: Settings.getMailUser(),
          to: email,
          text: `Ваш код авторизации: ${oneTimeCode}`
        }).then(() => {
          console.log('Письмо отправлено по адресу: ' + email + ' код авторизации: ' + oneTimeCode);
        }).catch((e) => {
          console.log('Send mail error', e);
        });

        return reply.ok({ success: true });
      }

      reply.internalServerError('Person id is undefined');
    } catch (error) {
      reply.internalServerError('Server error')
    }
  }

  private generateOneTimeCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}