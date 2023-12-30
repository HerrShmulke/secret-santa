
export interface IResponseService {
  ok<T>(data: T): void;
  created<T>(data: T): void;
  badRequest<T>(data: T): void;
  unauthorized(): void;
  notFound(): void;
  internalServerError(): void;
}
