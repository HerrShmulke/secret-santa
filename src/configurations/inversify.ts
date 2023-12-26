import 'reflect-metadata';
import { Container } from 'inversify';
import { GLOBAL_TYPES } from '../constants/global-types';
import { knexInstance } from './knex';

export const container = new Container();

container.bind(GLOBAL_TYPES.KNEX).toConstantValue(knexInstance);