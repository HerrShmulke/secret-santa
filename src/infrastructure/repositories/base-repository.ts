import { camelCase } from 'lodash';
import { Knex } from "knex";
import { transformKeysToSnakeCase } from '../../utils/object';

export interface IReader<T> {
  find(item: Partial<T>): Promise<T[]>;
  findOne(item: Partial<T>): Promise<T | undefined>;
}

export interface IWriter<TResponse> {
  create(item: Omit<TResponse, 'id'>): Promise<number>;
  update(id: number, item: Partial<TResponse>): Promise<TResponse>;
  delete(id: number): Promise<boolean>;
}

export type IBaseRepository<TResponse> = IReader<TResponse> & IWriter<TResponse>;

interface IEntityWithId {
  id: number;
};

export abstract class BaseRepository<TResponse extends IEntityWithId> implements IBaseRepository<TResponse> {
  constructor(
    private tableName: string,
    private knex: Knex
  ) {}

  find(item: Partial<TResponse>): Promise<TResponse[]> {
    return this.knex(this.tableName).where(transformKeysToSnakeCase(item));
  }

  findOne(item: Partial<TResponse>): Promise<TResponse | undefined> {
    return this.knex(this.tableName).where(transformKeysToSnakeCase(item)).first();
  }

  create(item: Omit<TResponse, "id">): Promise<number> {
    return this.knex(this.tableName).insert(transformKeysToSnakeCase(item)).then(result => result[0]);
  }

  update(id: number, item: Partial<TResponse>): Promise<TResponse> {
    return this.knex(this.tableName).where({ id }).update(transformKeysToSnakeCase(item)) as Promise<TResponse>;
  }

  delete(id: number): Promise<boolean> {
    return this.knex(this.tableName).where({ id }).delete();
  }
}