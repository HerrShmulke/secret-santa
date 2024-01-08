export class OneTimeCode {
  constructor(
    public id: number,
    public personId: number,
    public code: string,
    public expirationTime: Date
  ) {}
}