import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../infrastructure/constants/infrastructure-types";
import { IOneTimeCodeRepository } from "../../../infrastructure/repositories/one-time-code/one-time-code-repository";

export interface IOneTimeCodeService {
  generate(personId: number): Promise<string>;
}

@injectable()
export class OneTimeCodeService implements IOneTimeCodeService {
  constructor(
    @inject(INFRASTRUCTURE_TYPES.ONE_TIME_CODE_REPOSITORY) private readonly oneTimeCodeRepository: IOneTimeCodeRepository
  ) {}

  async generate(personId: number): Promise<string> {
    const oneTimeCode = this.createOneTimeCode();

    await this.oneTimeCodeRepository.create({ 
      personId, 
      code: oneTimeCode, 
      expirationTime: new Date(Date.now() + 60_000 * 60) 
    });

    return oneTimeCode;
  }

  private createOneTimeCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}