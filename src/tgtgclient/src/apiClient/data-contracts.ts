/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Basket {
  basketId?: string | null;
  name?: string | null;
  storeName?: string | null;
}

export interface CreateUserRequest {
  email?: string | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface UpdateBasketsFavoriteStatusRequest {
  basketsIds?: string[] | null;
  setAsFavorite?: boolean;
}

export interface User {
  /** @format uuid */
  id?: string;
  email?: string | null;
  favoriteBaskets?: string[] | null;
}
