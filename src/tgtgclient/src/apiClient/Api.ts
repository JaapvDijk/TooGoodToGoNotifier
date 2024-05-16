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

import {
  Basket,
  CreateUserRequest,
  GoogleIdToken,
  ProblemDetails,
  UpdateBasketsFavoriteStatusRequest,
  User,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Basket
   * @name BasketHelloworldList
   * @request GET:/api/Basket/helloworld
   */
  basketHelloworldList = (params: RequestParams = {}) =>
    this.request<string, ProblemDetails>({
      path: `/api/Basket/helloworld`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Basket
   * @name BasketFavoriteList
   * @summary Get favorite baskets
   * @request GET:/api/Basket/favorite
   */
  basketFavoriteList = (
    query?: {
      userEmail?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<Basket[], ProblemDetails>({
      path: `/api/Basket/favorite`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Basket
   * @name BasketFavoritePartialUpdate
   * @summary Set or remove baskets as favorite
   * @request PATCH:/api/Basket/favorite
   */
  basketFavoritePartialUpdate = (
    data: UpdateBasketsFavoriteStatusRequest,
    query?: {
      userEmail?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/Basket/favorite`,
      method: "PATCH",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Heartbeat
   * @name HeartbeatHeartbeatList
   * @request GET:/api/Heartbeat/heartbeat
   */
  heartbeatHeartbeatList = (params: RequestParams = {}) =>
    this.request<string, any>({
      path: `/api/Heartbeat/heartbeat`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Heartbeat
   * @name HeartbeatIsloggedinList
   * @request GET:/api/Heartbeat/isloggedin
   */
  heartbeatIsloggedinList = (params: RequestParams = {}) =>
    this.request<string, ProblemDetails>({
      path: `/api/Heartbeat/isloggedin`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name UserList
   * @summary Get all users
   * @request GET:/api/User
   */
  userList = (params: RequestParams = {}) =>
    this.request<User[], ProblemDetails>({
      path: `/api/User`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name UserCreate
   * @summary Create a user
   * @request POST:/api/User
   */
  userCreate = (data: CreateUserRequest, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/User`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags User
   * @name UserGoogleCreate
   * @request POST:/api/User/google
   */
  userGoogleCreate = (data: GoogleIdToken, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/User/google`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
