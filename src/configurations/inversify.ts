import 'reflect-metadata';
import { Container } from 'inversify';
import { GLOBAL_TYPES } from '../constants/global-types';
import { fastifyInstance } from './fastify';

export const containter = new Container();

containter.bind(GLOBAL_TYPES.FASTIFY).toConstantValue(fastifyInstance);