import { FastifyReply } from 'fastify';
import { IResponseService } from '../../domain/response/services/response-service';

export class ResponseService implements IResponseService {
  constructor(private readonly response: FastifyReply) {}

  ok(data: any): void {
    this.response.status(200).send(data);
  }
  
  internalServerError(message: string): void {
    this.response.status(500).send({ message });
  }
}