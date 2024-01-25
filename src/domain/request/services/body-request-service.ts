import { IRequestService } from "./request-service";

export interface IBodyRequestService<T> extends IRequestService {
  getBody(): T;
}