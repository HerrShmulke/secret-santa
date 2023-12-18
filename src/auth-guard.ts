import { FastifyReply, FastifyRequest } from "fastify";
import jwt from 'jsonwebtoken';
import { Settings } from '../config/settings';

export function authGuard(request: FastifyRequest, reply: FastifyReply, next: () => void) {
  const { bearer } = request.headers;

  if (bearer === undefined || typeof bearer !== 'string') {
    return reply.status(401).send({ message: 'Unauthorized' });
  }

  try {
    jwt.verify(bearer, Settings.getJwtSecret());
    next();
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
}