import { knexInstance } from '../config/knex';

type LoginCode = {
  id: number
  person_id: number;
  code: string;
  expiration_time: string;
}

export function createOneTimeCode(personId: number, code: string, expirationTime: Date, id?: number): Promise<LoginCode> {
  return knexInstance.insert({ code, id, person_id: personId, expiration_time: expirationTime.toISOString() }).into('one_time_codes');
}

export function getOneTimeCodeByPersonIdAndCode(personId: number, code: string): Promise<LoginCode | undefined> {
  return knexInstance<LoginCode>('one_time_codes').where({ person_id: personId, code }).first();
}