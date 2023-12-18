import { knexInstance } from '../config/knex';

type Gift = {
  id: number;
  owner_id: number;
  text: string;
  created_at: string;
  updated_at: string;
}

export function createGift(text: string, ownerId: number) {
  return knexInstance('gifts').insert({ text, owner_id: ownerId })
}

export function getGiftsByOwnerId(ownerId: number): Promise<Gift[]> {
  return knexInstance('gifts').select('*').where({ owner_id: ownerId });
}