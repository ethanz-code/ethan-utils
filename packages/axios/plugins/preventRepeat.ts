import type { AxiosInstance, AxiosRequestConfig } from "axios";

export interface PreventRepeatOptions {
  /** 重复请求时的回调函数 */
  onRepeat?: (msg: string, config: AxiosRequestConfig) => void;
  /** 需要防重复提交的请求方法，默认 ['POST', 'PUT', 'PATCH', 'DELETE', 'GET'] */
  methods?: string[];
}

/** 防重复提交错误类 */
export class PreventRepeatError extends Error {
  constructor(message: string = "请求重复，已被拦截") {
    super(message);
    this.name = "PreventRepeatError";
  }
}

// 存储正在进行的请求
const pendingRequests = new Map<string, AbortController>();

export function preventRepeatPlugin(
  api: AxiosInstance,
  options: PreventRepeatOptions = {},
) {
  const methods = options.methods ?? ["POST", "PUT", "PATCH", "DELETE", "GET"];
  const onRepeat =
    options.onRepeat ??
    ((msg) => {
      console.warn(msg);
    });

  // 生成请求唯一标识
  const generateRequestKey = (config: AxiosRequestConfig): string => {
    const method = (config.method || "").toLowerCase();
    let identifier;
    if (method === "get") {
      identifier =
        config.url + (config.params ? JSON.stringify(config.params) : "");
    } else {
      identifier =
        config.url +
        (typeof config.data === "object"
          ? JSON.stringify(config.data)
          : config.data || "");
    }
    return `${method}:${identifier}`;
  };

  // 请求拦截器
  api.interceptors.request.use((config) => {
    if (
      !methods
        .map((m) => m.toLowerCase())
        .includes((config.method || "").toLowerCase())
    ) {
      return config;
    }

    const requestKey = generateRequestKey(config);

    // 检查是否有相同的请求正在进行
    if (pendingRequests.has(requestKey)) {
      // 终止之前的请求
      const existingController = pendingRequests.get(requestKey);
      if (existingController) {
        existingController.abort();
        pendingRequests.delete(requestKey);
      }
      onRepeat("请求重复，已被拦截", config);
    }

    // 创建 AbortController 并存储
    const abortController = new AbortController();
    pendingRequests.set(requestKey, abortController);

    // 将 signal 添加到请求配置中
    config.signal = abortController.signal;

    return config;
  });

  // 响应拦截器 - 成功时清理
  api.interceptors.response.use(
    (response) => {
      const requestKey = generateRequestKey(response.config);
      pendingRequests.delete(requestKey);
      return response;
    },
    (error) => {
      // 响应错误时也要清理
      if (error.config) {
        const requestKey = generateRequestKey(error.config);
        pendingRequests.delete(requestKey);
      }
      return Promise.reject(error);
    },
  );
}

export const preventRepeat = preventRepeatPlugin;
export default preventRepeatPlugin;
