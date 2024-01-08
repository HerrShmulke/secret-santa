import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { inject, injectable } from 'inversify';
import { GLOBAL_TYPES } from '../../../constants/global-types';
import { PRESENTATION_TYPES } from '../../constants/presentation-types';
import { IAuthService } from '../../services/auth/auth-service';
import { MailNotSentError, OneTimeCodeNotFoundError, PersonIdNotFoundError } from '../../services/auth/auth-service.errors';
import { IAuthController } from './auth-controller.interfaces';
import { ILoginRequestSchema, loginSchema, IVerifyRequestSchema, verifySchema } from './auth-controller.schema';

@injectable()
export class AuthController implements IAuthController {
  private readonly BASE_URL = '/auth';
  
  constructor(
    @inject(GLOBAL_TYPES.FASTIFY) private readonly fastify: FastifyInstance,
    @inject(PRESENTATION_TYPES.AUTH_SERVICE) private readonly authService: IAuthService
  ) {}

  async registerRoutes(): Promise<void> {
    this.fastify.post<ILoginRequestSchema>(`${this.BASE_URL}/login`, { schema: loginSchema }, (req, res) => this.login(req, res));
    this.fastify.post<IVerifyRequestSchema>(`${this.BASE_URL}/verify`, { schema: verifySchema }, (req, res) => this.verify(req, res));
  }

  private async login(request: FastifyRequest<ILoginRequestSchema>, reply: FastifyReply) {
    const { email } = request.body;

    try {
      await this.authService.login(email);
      reply.status(200).send({ success: true });
    } catch (error) {
      if (error instanceof MailNotSentError) {
        reply.status(500).send({ message: 'Сообщение не было отправлено' });
      } else if (error instanceof PersonIdNotFoundError) {
        reply.status(500).send({ message: 'Не удалось создать пользователя' });
      } else {
        reply.status(500).send({ message: 'Неизвестная ошибка' });
      }
    }
  }

  private async verify(request: FastifyRequest<IVerifyRequestSchema>, reply: FastifyReply) {
    const { email, oneTimeCode } = request.body;
    
    try {
      const accessToken = await this.authService.verify(email, oneTimeCode);
      reply.status(200).send({ accessToken });
    } catch (error) {
      if (error instanceof PersonIdNotFoundError) {
        reply.status(404).send({ message: 'Пользователь не найден' });
      } else if (error instanceof OneTimeCodeNotFoundError) {
        reply.status(404).send({ message: 'Проверочный код не найден или не действителен' });
      } else {
        reply.status(500).send({ message: 'Неизвестная ошибка' });
      }
    }
  }
}