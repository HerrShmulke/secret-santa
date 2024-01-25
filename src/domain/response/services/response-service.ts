export interface IResponseService {
  ok(data: any): void;
  internalServerError(message: string): void; 
}