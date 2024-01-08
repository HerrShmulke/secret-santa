import { interfaces } from 'inversify'
import { INFRASTRUCTURE_TYPES } from './constants/infrastructure-types';
import { PersonMigration } from './migrations/person/person-migration';
import { PersonRepository } from './repositories/person/person-repository';
import { OneTimeCodeMigration } from './migrations/one-time-code/one-time-code-migration';
import { OneTimeCodeRepository } from './repositories/one-time-code/one-time-code-repository';

export function bindInfrastructureTypes(bind: interfaces.Bind): void {
  bind(INFRASTRUCTURE_TYPES.PERSON_MIGRATION).to(PersonMigration);
  bind(INFRASTRUCTURE_TYPES.PERSON_REPOSITORY).to(PersonRepository);
  bind(INFRASTRUCTURE_TYPES.ONE_TIME_CODE_MIGRATION).to(OneTimeCodeMigration);
  bind(INFRASTRUCTURE_TYPES.ONE_TIME_CODE_REPOSITORY).to(OneTimeCodeRepository);
}