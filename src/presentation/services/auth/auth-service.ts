import { inject, injectable } from "inversify";
import { INFRASTRUCTURE_TYPES } from "../../../infrastructure/constants/infrastructure-types";
import { IPersonRepository } from "../../../infrastructure/repositories/person/person-repository";
import { PRESENTATION_TYPES } from "../../constants/presentation-types";
import { IOneTimeCodeService } from "../one-time-code/one-time-code-service";
import { IMailService } from "../mail/mail-service";
import { PersonIdNotFoundError, MailNotSentError, OneTimeCodeNotFoundError } from "./auth-service.errors";
import { IOneTimeCodeRepository } from "../../../infrastructure/repositories/one-time-code/one-time-code-repository";
import jwt from 'jsonwebtoken';
import { Settings } from "../../../../config/settings";

export interface IAuthService {
  login(email: string): Promise<void>;
  verify(email: string, oneTimeCode: string): Promise<string>;
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(INFRASTRUCTURE_TYPES.PERSON_REPOSITORY) private readonly personRepository: IPersonRepository,
    @inject(PRESENTATION_TYPES.ONE_TIME_CODE_SERVICE) private readonly oneTimeCodeService: IOneTimeCodeService,
    @inject(PRESENTATION_TYPES.MAIL_SERVICE) private readonly mailService: IMailService,
    @inject(INFRASTRUCTURE_TYPES.ONE_TIME_CODE_REPOSITORY) private readonly oneTimeCodeRepository: IOneTimeCodeRepository
  ) {}

  async login(email: string) {
    const person = await this.personRepository.findOne({ email });
    const isPersonFound = person !== undefined;
    
    let personId = null;

    if (isPersonFound) {
      personId = person.id;
    } else {
      personId = await this.personRepository.create({ email });
    }

    if (personId === null || personId === undefined) {
      throw new PersonIdNotFoundError();
    }

    const oneTimeCode = await this.oneTimeCodeService.generate(personId);

    try {
      await this.mailService.sendText(email, `Ваш код авторизации: ${oneTimeCode}`);
    } catch {
      throw new MailNotSentError();
    }
  }

  async verify(email: string, oneTimeCode: string): Promise<string> {
    const person = await this.personRepository.findOne({ email });

    if (person === undefined) {
      throw new PersonIdNotFoundError();
    }

    const code = await this.oneTimeCodeRepository.findOne({ personId: person.id, code: oneTimeCode });

    if (code === undefined || new Date(code.expirationTime) < new Date()) {
      throw new OneTimeCodeNotFoundError();
    }

    const accessToken = jwt.sign({ personId: person.id }, Settings.getJwtSecret(), {
      expiresIn: '100 days'
    });

    return accessToken;
  }
}