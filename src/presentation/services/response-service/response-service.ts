import { FastifyReply } from 'fastify'

export interface IResponseService {
  ok<T>(data: T): void;
  created<T>(data: T): void;
  badRequest<T>(data: T): void;
  unauthorized(): void;
  notFound(): void;
  internalServerError(): void;
}

export class ResponseService implements IResponseService {
  constructor(private readonly fastifyReply: FastifyReply) {}
  
  ok<T>(data: T): void {
    this.fastifyReply.status(200).send(data);
  }

  created<T>(data: T): void {
    this.fastifyReply.status(201).send(data);
  }

  badRequest<T>(data: T): void {
    this.fastifyReply.status(400).send(data);
  }

  unauthorized(): void {
    this.fastifyReply.status(401).send({ message: 'Unauthorized' });
  }

  notFound(): void {
    this.fastifyReply.status(404).send({ message: 'Not found' });
  }

  internalServerError(): void {
    this.fastifyReply.status(500).send({ message: 'Internal server error' });
  }

}