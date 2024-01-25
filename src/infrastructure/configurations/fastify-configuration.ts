import { inject, injectable } from 'inversify';
import { INFRASTRUCTURE_TYPES } from '../constants/infrastructure-types';
import { IAuthController } from '../controllers/auth-controller';
import { AuthLoginBodyRequestService } from '../services/auth/auth-login-body-request-service';
import { ILoginRequestAuthDTO } from '../dtos/auth/login-auth-dto';
import { ResponseService } from '../services/response-service';
import { IRouterConfiguration } from '../../domain/configurations/router-configuration';
import { fastifyInstance } from '../../configurations/fastify';
import { FastifyInstance } from 'fastify';

@injectable()
export class FastifyConfiguration implements IRouterConfiguration {
  private readonly fastify: FastifyInstance;
  
  constructor(
    @inject(INFRASTRUCTURE_TYPES.AUTH_CONTROLLER) private readonly authController: IAuthController
  ) {
    this.fastify = fastifyInstance;
  }

  setupRoutes() {
    this.fastify.post<{
      Body: ILoginRequestAuthDTO
    }>('/auth/login', (req, res) => {
      this.authController.login(new AuthLoginBodyRequestService(req), new ResponseService(res));
    });
  }
}