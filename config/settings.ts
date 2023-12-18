import { config } from 'dotenv';
config();

export class Settings {
  static getJwtSecret(): string {
    return process.env.SECRET_KEY ?? '';
  }

  static getMailUser(): string {
    return process.env.MAIL_USER ?? '';
  }

  static getMailPassword(): string {
    return process.env.MAIL_PASSWORD ?? '';
  }

  static getServerPort(): number {
    return Number(process.env.SERVER_PORT) ?? 443;
  }
}