import { snakeCase, camelCase } from 'lodash';

type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}` ?
  `${T extends Capitalize<T> ? "_" : ""}${Lowercase<T>}${CamelToSnakeCase<U>}` :
  S;

type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}` ?
  `${T}${Capitalize<SnakeToCamelCase<U>>}` :
  S

type CamelToSnakeCaseNested<T> = T extends object ? {
  [K in keyof T as CamelToSnakeCase<K & string>]: CamelToSnakeCaseNested<T[K]>
} : T;

type SnakeToCamelCaseNested<T> = T extends object ? {
  [K in keyof T as SnakeToCamelCase<K & string>]: SnakeToCamelCaseNested<T[K]>
} : T;



export function transformKeysToSnakeCase<T extends { [key: string]: any }>(obj: T): CamelToSnakeCaseNested<T> {
  return Object.keys(obj).reduce((resultObject, key) => {
    return {
      ...resultObject,
      [snakeCase(key)]: obj[key]
    }
  }, {} as CamelToSnakeCaseNested<T>);
}

export function transformKeysToCamelCase<T extends { [key: string]: any }>(obj: T): SnakeToCamelCaseNested<T> {
  return Object.keys(obj).reduce((resultObject, key) => {
    return {
      ...resultObject,
      [camelCase(key)]: obj[key]
    }
  }, {} as SnakeToCamelCaseNested<T>);
}