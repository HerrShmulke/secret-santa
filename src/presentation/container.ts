import { interfaces } from 'inversify'
import { PRESENTATION_TYPES } from './constants/presentation-types';
import { AuthController } from './controllers/auth/auth-controller';
import { AuthService } from './services/auth/auth-service';
import { OneTimeCodeService } from './services/one-time-code/one-time-code-service';
import { MailService } from './services/mail/mail-service';

export function bindPresentationTypes(bind: interfaces.Bind): void {
  bind(PRESENTATION_TYPES.AUTH_CONTROLLER).to(AuthController);
  bind(PRESENTATION_TYPES.AUTH_SERVICE).to(AuthService);
  bind(PRESENTATION_TYPES.ONE_TIME_CODE_SERVICE).to(OneTimeCodeService);
  bind(PRESENTATION_TYPES.MAIL_SERVICE).to(MailService).inSingletonScope();
}