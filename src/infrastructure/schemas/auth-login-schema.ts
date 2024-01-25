import { FastifySchema } from 'fastify';
import S from 'fluent-json-schema';

export const authLoginSchema: FastifySchema = { body: S.object().prop('email', S.string().required()) };