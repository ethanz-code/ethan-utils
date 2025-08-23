import type { AxiosRequestConfig, AxiosError, AxiosInstance } from "axios";
import axios from "axios";
import { createApi, type CreateApiOptions, type AxiosPlugin } from "./base";

/**
 * 标准化 API 响应结构
 * @template T - 响应数据的类型。
 */
export interface BaseResponse<T> {
  data: T; // 实际数据
  message: string; // 提示信息
  code: number; // 业务状态码
}

/**
 * API 客户端接口，包含所有请求方法和插件系统
 */
interface ApiClient {
  get<T, R extends BaseResponse<T> = BaseResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  post<T, R extends BaseResponse<T> = BaseResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  put<T, R extends BaseResponse<T> = BaseResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  delete<T, R extends BaseResponse<T> = BaseResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  patch<T, R extends BaseResponse<T> = BaseResponse<T>>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<R>;
  use<T>(plugin: AxiosPlugin<T>, options?: T): void;
  raw: {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T>;
    put<T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    patch<T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T>;
  };
}

/**
 * 格式化错误为标准响应结构
 * @param error 捕获的错误
 * @returns 标准化响应
 */
const formatError = <T>(error: unknown): BaseResponse<T> => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<BaseResponse<any>>;
    // 如果后端有返回错误体，则直接使用
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }
    // 否则，构造一个标准的错误响应
    return {
      message: axiosError.message || "请求发生错误",
      code: axiosError.response?.status || 500,
      data: null,
    } as BaseResponse<T>;
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 500,
      data: null,
    } as BaseResponse<T>;
  }

  return {
    message: "未知错误",
    code: 500,
    data: null,
  } as BaseResponse<T>;
};

/**
 * 创建 API 客户端，包含常用请求方法和原始请求方法（raw）
 * @param api Axios 实例
 * @returns 标准请求方法和 raw 原始方法
 */
function createClient(api: AxiosInstance): ApiClient {
  const methods = {
    /** GET 请求，返回标准响应结构 */
    async get<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.get<R>(url, config);
        return response.data;
      } catch (error: unknown) {
        return formatError<T>(error) as R;
      }
    },
    /** GET 原始请求，返回 data 部分，失败抛出异常 */
    async getRaw<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      const response = await api.get<T>(url, config);
      return response.data;
    },
    /** POST 请求，返回标准响应结构 */
    async post<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.post<R>(url, data, config);
        return response.data;
      } catch (error: unknown) {
        return formatError<T>(error) as R;
      }
    },
    /** POST 原始请求，返回 data 部分，失败抛出异常 */
    async postRaw<T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const response = await api.post<T>(url, data, config);
      return response.data;
    },
    /** PUT 请求，返回标准响应结构 */
    async put<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.put<R>(url, data, config);
        return response.data;
      } catch (error: unknown) {
        return formatError<T>(error) as R;
      }
    },
    /** PUT 原始请求，返回 data 部分，失败抛出异常 */
    async putRaw<T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const response = await api.put<T>(url, data, config);
      return response.data;
    },
    /** DELETE 请求，返回标准响应结构 */
    async delete<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.delete<R>(url, config);
        return response.data;
      } catch (error: unknown) {
        return formatError<T>(error) as R;
      }
    },
    /** DELETE 原始请求，返回 data 部分，失败抛出异常 */
    async deleteRaw<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
      const response = await api.delete<T>(url, config);
      return response.data;
    },
    /** PATCH 请求，返回标准响应结构 */
    async patch<T, R extends BaseResponse<T> = BaseResponse<T>>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<R> {
      try {
        const response = await api.patch<R>(url, data, config);
        return response.data;
      } catch (error: unknown) {
        return formatError<T>(error) as R;
      }
    },
    /** PATCH 原始请求，返回 data 部分，失败抛出异常 */
    async patchRaw<T>(
      url: string,
      data?: unknown,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const response = await api.patch<T>(url, data, config);
      return response.data;
    },
  };

  const { getRaw, postRaw, putRaw, deleteRaw, patchRaw } = methods;

  return {
    ...methods,
    use<T>(plugin: AxiosPlugin<T>, options?: T): void {
      plugin(api, options);
    },
    raw: {
      get: getRaw,
      post: postRaw,
      put: putRaw,
      delete: deleteRaw,
      patch: patchRaw,
    },
  };
}

let apiClientInstance: ApiClient | null = null;

/**
 * 创建/初始化 API 客户端
 * @param options 配置项
 * @param isSingleton 是否为单例，默认 true
 * @returns 请求客户端实例（单例或新实例）
 */
export function createRequest(
  options: CreateApiOptions,
  isSingleton = true,
): ApiClient {
  if (isSingleton) {
    if (!apiClientInstance) {
      const api = createApi(options);
      apiClientInstance = createClient(api);
    }
    return apiClientInstance;
  } else {
    const api = createApi(options);
    return createClient(api);
  }
}

/**
 * 全局请求客户端，需先调用 createRequest 初始化
 * - request.get/post/put/delete/patch 返回 BaseResponse
 * - request.raw.get/post/put/delete/patch 返回原始 data，失败抛出异常
 */
export const request = new Proxy(
  {},
  {
    get(_, prop: string) {
      if (!apiClientInstance) {
        throw new Error(
          "API client has not been initialized. Please call createRequest() first.",
        );
      }
      return Reflect.get(apiClientInstance, prop);
    },
  },
) as ApiClient;

/**
 * request 的简写别名
 */
export const r = request;

export type { CreateApiOptions };
export type { AxiosRequestConfig } from "axios";

// 导出所有插件
export {
  limitBodySizePlugin,
  limitBodySize,
  preventRepeatPlugin,
  preventRepeat,
  unauthorizedPlugin,
  unauthorized,
} from "./plugins";
