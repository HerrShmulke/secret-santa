import { inject, injectable } from "inversify";
import { OneTimeCode } from "../../../domain/models/one-time-code/one-time-code";
import { BaseRepository, IBaseRepository } from "../base-repository";
import { GLOBAL_TYPES } from "../../../constants/global-types";
import { Knex } from "knex";
import { ONE_TIME_CODE_TABLE_NAME } from "../../migrations/one-time-code/one-time-code-migration.interfaces";

export type IOneTimeCodeRepository = IBaseRepository<OneTimeCode>;

@injectable()
export class OneTimeCodeRepository extends BaseRepository<OneTimeCode> implements IOneTimeCodeRepository {
  constructor(
    @inject(GLOBAL_TYPES.KNEX) knex: Knex
  ) {
    super(ONE_TIME_CODE_TABLE_NAME, knex);
  }
}