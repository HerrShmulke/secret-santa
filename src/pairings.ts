import { knexInstance } from "../config/knex";

type Pair = {
  santaId: number;
  recipientId: number;
}

type PairDb = {
  id: number;
  santa_id: number;
  recipient_id: number;
}

export function setPairings(pairings: Pair[]) {
  return knexInstance<PairDb>('pairings').insert(pairings.map((pair) => ({ recipient_id: pair.recipientId, santa_id: pair.santaId })));
}

export function getParingBySantaId(santaId: number) {
  return knexInstance<PairDb>('pairings').where({ santa_id: santaId }).first();
}