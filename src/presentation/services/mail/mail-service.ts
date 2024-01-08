import nodemailer, { Transporter } from 'nodemailer';
import { Settings } from '../../../../config/settings';
import { injectable } from 'inversify';

export interface IMailService {
  sendText(to: string, text: string): Promise<void>;
}

@injectable()
export class MailService implements IMailService {
  private transporter: Transporter;
  private readonly SMTP_PORT = 465;
  private readonly SMTP_HOST = 'smtp.mail.ru';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: this.SMTP_HOST,
      port: this.SMTP_PORT,
      secure: true,
      auth: {
        user: Settings.getMailUser(),
        pass: Settings.getMailPassword(),
      }
    });
  }

  sendText(to: string, text: string) {
    return this.transporter.sendMail({
      from: Settings.getMailUser(),
      to,
      text,
    })
  }
}