import { inject, injectable } from "inversify";
import { Person } from "../../../domain/models/person/person";
import { BaseRepository, IBaseRepository } from "../base-repository";
import { GLOBAL_TYPES } from "../../../constants/global-types";
import { Knex } from "knex";
import { PERSON_TABLE_NAME } from '../../migrations/person/person-migration.interfaces'

export type IPersonRepository = IBaseRepository<Person>;

@injectable()
export class PersonRepository extends BaseRepository<Person> implements IPersonRepository {
  constructor(
    @inject(GLOBAL_TYPES.KNEX) knex: Knex
  ) {
    super(PERSON_TABLE_NAME, knex);
  }
}