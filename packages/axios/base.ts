import axios, {
  type AxiosInstance,
  type AxiosError,
  type CreateAxiosDefaults,
} from "axios";
import axiosRetry from "axios-retry";
import qs from "qs";

/**
 * @interface CreateApiOptions
 * @description 创建 API 实例的配置选项
 */
export interface CreateApiOptions {
  /**
   * @property {string} baseURL - API 的基础 URL
   */
  baseURL: string;
  /**
   * @property {() => string | null} [getToken] - 获取认证令牌的函数
   */
  getToken?: () => string | null;
  /**
   * @property {() => void} [onUnauthorized] - 当收到 401 未授权响应时的回调函数
   */
  onUnauthorized?: () => void;
  /**
   * @property {number} [timeout] - 请求超时时间
   */
  timeout?: number;
}

// 插件类型
export type AxiosPlugin<T = any> = (api: AxiosInstance, options?: T) => void;

// 扩展 AxiosInstance
export interface AxiosInstanceWithUse extends AxiosInstance {
  use<T>(plugin: AxiosPlugin<T>, opts?: T): void;
}

/**
 * 创建一个配置好的 Axios 实例
 * @param {CreateApiOptions} options - API 客户端的配置选项
 * @returns {AxiosInstanceWithUse} 返回一个集成了请求重试、请求头注入和响应拦截的 Axios 实例
 */
export function createApi(options: CreateApiOptions): AxiosInstanceWithUse {
  const headers = {
    "Content-Type": "application/json",
  };

  const axiosConfig: CreateAxiosDefaults = {
    baseURL: options.baseURL,
    headers,
    timeout: options.timeout || 10000,
    paramsSerializer: {
      serialize: (params) => {
        return qs.stringify(params, { arrayFormat: "brackets" });
      },
    },
  };

  const api = axios.create(axiosConfig) as AxiosInstanceWithUse;

  // 添加 use 方法
  api.use = function <T>(plugin: AxiosPlugin<T>, opts?: T): void {
    plugin(api, opts);
  };

  // 添加请求拦截器来动态设置 token
  if (options.getToken) {
    api.interceptors.request.use((config) => {
      const token = options.getToken!();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    });
  }

  // 配置重试
  axiosRetry(api, {
    retries: 3,
    retryDelay: (retryCount) => {
      return retryCount * 1000;
    },
    retryCondition: (error: AxiosError) => {
      return (
        axiosRetry.isNetworkError(error) ||
        axiosRetry.isRetryableError(error) ||
        (error.response?.status !== undefined && error.response.status >= 500)
      );
    },
  });

  // 响应拦截器
  api.interceptors.response.use(
    (response) => {
      if (response.data.code === 401) {
        options.onUnauthorized?.();
      }
      return response;
    },
    (error) => Promise.reject(error),
  );

  return api;
}
