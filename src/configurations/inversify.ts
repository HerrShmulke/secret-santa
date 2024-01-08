import 'reflect-metadata';
import { Container } from 'inversify';
import { GLOBAL_TYPES } from '../constants/global-types';
import { knexInstance } from './knex';
import { fastifyInstance } from './fastify';
import { bindInfrastructureTypes } from '../infrastructure/container';

export const container = new Container();

container.bind(GLOBAL_TYPES.KNEX).toConstantValue(knexInstance);
container.bind(GLOBAL_TYPES.FASTIFY).toConstantValue(fastifyInstance);

bindInfrastructureTypes(container.bind);