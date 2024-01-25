import { FastifyRequest } from 'fastify';
import { IBodyRequestService } from "../../../domain/request/services/body-request-service";
import { ILoginRequestAuthDTO } from "../../dtos/auth/login-auth-dto";

export class AuthLoginBodyRequestService implements IBodyRequestService<ILoginRequestAuthDTO> {
  constructor(private readonly request: FastifyRequest<{
    Body: ILoginRequestAuthDTO
  }>) {}
  
  getBody(): ILoginRequestAuthDTO {
    const requestBody = this.request.body;

    return requestBody;
  }
}