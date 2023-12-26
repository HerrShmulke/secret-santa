import { container } from '../configurations/inversify';
import { INFRASTRUCTURE_TYPES } from './constants/infrastructure-types';
import { PersonMigration } from './migrations/person/person-migration';

container.bind(INFRASTRUCTURE_TYPES.PERSON_MIGRATION).to(PersonMigration);