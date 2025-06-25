/**
 * @file packages/axios/index.ts
 * @description 封装全局通用的 API 请求方法及类型声明，统一错误处理，便于全局调用。
 * @author Ethan Zhang
 * @date 2025-07-24
 */

import type { AxiosRequestConfig, AxiosError, AxiosInstance } from "axios";
import axios from "axios";
import { createApi, type CreateApiOptions } from "./base";

/**
 * @interface BaseResponse
 * @description 标准化的 API 响应体结构。
 * @template T - 响应数据的类型。
 */
export interface BaseResponse<T> {
  /**
   * @property {T} data - 实际的响应数据。
   */
  data: T;
  /**
   * @property {string} msg - 来自服务端的响应消息，通常用于显示提示信息。
   */
  msg: string;
  /**
   * @property {number} code - 自定义的业务状态码，例如 200 表示成功，其他值表示不同类型的错误。
   */
  code: number;
}

/**
 * @global
 * @typedef {Object} BaseResponse<T>
 * @property {T} data - 响应数据
 * @property {string} msg - 响应消息
 * @property {number} code - 响应状态码
 */

/**
 * 统一的错误处理函数。
 * @template T
 * @param {unknown} error - 捕获到的错误对象。
 * @returns {BaseResponse<T>} 标准化的错误响应对象。
 */
const handleError = <T>(error: unknown): BaseResponse<T> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<BaseResponse<any>>;
    // 如果后端有返回错误体，则直接使用
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }
    // 否则，构造一个标准的错误响应
    return {
      msg: axiosError.message || "请求发生错误",
      code: axiosError.response?.status || 500,
      data: null,
    } as BaseResponse<T>;
  }

  if (error instanceof Error) {
    return {
      msg: error.message,
      code: 500,
      data: null,
    } as BaseResponse<T>;
  }

  return {
    msg: "未知错误",
    code: 500,
    data: null,
  } as BaseResponse<T>;
};

/**
 * 创建一个 API 客户端，包含常用的请求方法。
 * @param {AxiosInstance} api - 通过 `createApi` 创建的 Axios 实例。
 * @returns {object} 返回一个包含标准请求方法和 `withoutBaseResponse` 嵌套对象的方法集合。
 * - `get`, `post`, `put`, `delete`, `patch`: 这些方法返回 `BaseResponse<T>` 格式的响应，并内置错误处理。
 * - `withoutBaseResponse`: 这个对象包含了不经过 `BaseResponse` 包装的原始请求方法，当请求失败时会直接抛出 `AxiosError`，需要手动 `try...catch`。
 */
function createApiClient(api: AxiosInstance) {
  const methods = {
    /**
     * 发起 GET 请求。
     * @template T - 期望的响应数据类型（位于 `BaseResponse.data` 中）。
     * @param {string} url - 请求的 URL。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<BaseResponse<T>>} 返回一个标准的响应体。
     */
    async get<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.get<R>(url, config);
        return response.data;
      } catch (error: unknown) {
        return handleError<T>(error) as R;
      }
    },

    /**
     * 发起 GET 请求，但直接返回响应体中的 `data` 部分，不包装 `BaseResponse`。
     * @template T - 期望的响应数据类型。
     * @param {string} url - 请求的 URL。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<T>} 成功时返回数据，失败时抛出 `AxiosError`。
     */
    async getWithoutBaseResponse<T>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const response = await api.get<T>(url, config);
      return response.data;
    },

    /**
     * 发起 POST 请求。
     * @template T - 期望的响应数据类型（位于 `BaseResponse.data` 中）。
     * @param {string} url - 请求的 URL。
     * @param {unknown} [data] - 请求体数据。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<BaseResponse<T>>} 返回一个标准的响应体。
     */
    async post<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.post<R>(url, data, config);
        return response.data;
      } catch (error: unknown) {
        return handleError<T>(error) as R;
      }
    },

    /**
     * 发起 POST 请求，但直接返回响应体中的 `data` 部分，不包装 `BaseResponse`。
     * @template T - 期望的响应数据类型。
     * @param {string} url - 请求的 URL。
     * @param {unknown} [data] - 请求体数据。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<T>} 成功时返回数据，失败时抛出 `AxiosError`。
     */
    async postWithoutBaseResponse<T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const response = await api.post<T>(url, data, config);
      return response.data;
    },

    /**
     * 发起 PUT 请求。
     * @template T - 期望的响应数据类型（位于 `BaseResponse.data` 中）。
     * @param {string} url - 请求的 URL。
     * @param {unknown} [data] - 请求体数据。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<BaseResponse<T>>} 返回一个标准的响应体。
     */
    async put<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.put<R>(url, data, config);
        return response.data;
      } catch (error: unknown) {
        return handleError<T>(error) as R;
      }
    },

    /**
     * 发起 PUT 请求，但直接返回响应体中的 `data` 部分，不包装 `BaseResponse`。
     * @template T - 期望的响应数据类型。
     * @param {string} url - 请求的 URL。
     * @param {unknown} [data] - 请求体数据。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<T>} 成功时返回数据，失败时抛出 `AxiosError`。
     */
    async putWithoutBaseResponse<T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const response = await api.put<T>(url, data, config);
      return response.data;
    },

    /**
     * 发起 DELETE 请求。
     * @template T - 期望的响应数据类型（位于 `BaseResponse.data` 中）。
     * @param {string} url - 请求的 URL。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<BaseResponse<T>>} 返回一个标准的响应体。
     */
    async delete<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.delete<R>(url, config);
        return response.data;
      } catch (error: unknown) {
        return handleError<T>(error) as R;
      }
    },

    /**
     * 发起 DELETE 请求，但直接返回响应体中的 `data` 部分，不包装 `BaseResponse`。
     * @template T - 期望的响应数据类型。
     * @param {string} url - 请求的 URL。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<T>} 成功时返回数据，失败时抛出 `AxiosError`。
     */
    async deleteWithoutBaseResponse<T>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const response = await api.delete<T>(url, config);
      return response.data;
    },

    /**
     * 发起 PATCH 请求。
     * @template T - 期望的响应数据类型（位于 `BaseResponse.data` 中）。
     * @param {string} url - 请求的 URL。
     * @param {unknown} [data] - 请求体数据。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<BaseResponse<T>>} 返回一个标准的响应体。
     */
    async patch<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.patch<R>(url, data, config);
        return response.data;
      } catch (error: unknown) {
        return handleError<T>(error) as R;
      }
    },

    /**
     * 发起 PATCH 请求，但直接返回响应体中的 `data` 部分，不包装 `BaseResponse`。
     * @template T - 期望的响应数据类型。
     * @param {string} url - 请求的 URL。
     * @param {unknown} [data] - 请求体数据。
     * @param {AxiosRequestConfig} [config] - Axios 的请求配置。
     * @returns {Promise<T>} 成功时返回数据，失败时抛出 `AxiosError`。
     */
    async patchWithoutBaseResponse<T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const response = await api.patch<T>(url, data, config);
      return response.data;
    },
  };

  const {
    getWithoutBaseResponse,
    postWithoutBaseResponse,
    putWithoutBaseResponse,
    deleteWithoutBaseResponse,
    patchWithoutBaseResponse,
    ...rest
  } = methods;

  return {
    ...rest,
    withoutBaseResponse: {
      get: getWithoutBaseResponse,
      post: postWithoutBaseResponse,
      put: putWithoutBaseResponse,
      delete: deleteWithoutBaseResponse,
      patch: patchWithoutBaseResponse,
    },
  };
}

let apiClientInstance: ReturnType<typeof createApiClient> | null = null;

/**
 * 初始化 API 客户端（单例）
 * @param {CreateApiOptions} options - API 客户端配置，例如 `baseURL`。
 * @description 必须在应用启动时调用一次，重复调用会收到警告。
 * @example
 * // 在 main.ts 或 app.ts 中
 * import { initApiClient } from '@monorepo-vue-starter/axios';
 *
 * initApiClient({
 *   baseURL: 'https://api.example.com',
 *   getToken: () => localStorage.getItem('token'),
 * });
 */
export function initApiClient(options: CreateApiOptions): void {
  if (apiClientInstance) {
    console.warn("API client has already been initialized.");
    return;
  }
  const api = createApi(options);
  apiClientInstance = createApiClient(api);
}

/**
 * 导出的单例请求客户端 `request`。
 * 这是一个代理对象，确保在使用前 `initApiClient` 已被调用。
 * 它包含了所有标准的 HTTP 请求方法，如 `get`, `post` 等。
 * 同时，通过 `request.withoutBaseResponse` 提供了不包装响应的备用方法。
 * @description 在使用前必须先调用 `initApiClient` 进行初始化。
 * @example
 * // 使用标准方法
 * import { request } from '@monorepo-vue-starter/axios';
 * const res = await request.get('/users');
 * if (res.code === 200) {
 *   console.log(res.data);
 * }
 *
 * // 使用不包装响应的方法
 * try {
 *   const data = await request.withoutBaseResponse.get('/profile');
 *   console.log(data);
 * } catch (error) {
 *   // 处理 Axios 错误
 * }
 */
export const request = new Proxy(
  {},
  {
    get(_, prop: string) {
      if (!apiClientInstance) {
        throw new Error(
          "API client has not been initialized. Please call initApiClient() first.",
        );
      }
      return Reflect.get(apiClientInstance, prop);
    },
  },
) as ReturnType<typeof createApiClient>;

export type { CreateApiOptions };
export { createApi, createApiClient };
