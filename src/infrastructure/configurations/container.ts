import { interfaces } from 'inversify';
import { INFRASTRUCTURE_TYPES } from '../constants/infrastructure-types';
import { AuthController } from '../controllers/auth-controller';
import { FastifyConfiguration } from './fastify-configuration';

export function bindInfrastructureContainer(bind: interfaces.Bind) {
  bind(INFRASTRUCTURE_TYPES.AUTH_CONTROLLER).to(AuthController);
  bind(INFRASTRUCTURE_TYPES.FASTIFY_CONFIGURATION).to(FastifyConfiguration);
}