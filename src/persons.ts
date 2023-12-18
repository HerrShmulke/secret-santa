import { knexInstance } from '../config/knex';

interface Person {
  id: number;
  name: string;
  email: string;
  gift: string;
}

export function createPerson(
  email: string,
  name?: string,
  id?: number,
): Promise<number[]> {
  return knexInstance.insert({ id, name, email }).into('persons');
}

export function getPersonById(id: number): Promise<Person | undefined> {
  return knexInstance<Person>('persons').where({ id }).first();
}

export function getPersonByEmail(email: string): Promise<Person | undefined> {
  return knexInstance<Person>('persons').where({ email }).first();
}

export function updatePersonById(person: { id: number, name?: string, gift?: string }) {
  return knexInstance<Person>('persons').update({ name: person.name, gift: person.gift }).where({ id: person.id });
}