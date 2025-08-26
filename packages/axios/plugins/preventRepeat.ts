import type { AxiosInstance, AxiosRequestConfig } from "axios";

export interface PreventRepeatOptions {
  /** 防重复提交的时间间隔，单位毫秒，默认 1000ms */
  interval?: number;
  /** 重复请求时的回调函数 */
  onRepeat?: (msg: string, config: AxiosRequestConfig) => void;
  /** 需要防重复提交的请求方法，默认 ['POST', 'PUT', 'PATCH', 'DELETE'] */
  methods?: string[];
}

/** 防重复提交错误类 */
export class PreventRepeatError extends Error {
  constructor(message: string = "请求重复，已被拦截") {
    super(message);
    this.name = "PreventRepeatError";
  }
}

const sessionKey = "__ethan_utils_repeat_submit__";

export function preventRepeatPlugin(
  api: AxiosInstance,
  options: PreventRepeatOptions = {},
) {
  const interval = options.interval ?? 1000;
  const onRepeat =
    options.onRepeat ??
    ((msg) => {
      console.warn(msg);
    });

  api.interceptors.request.use((config) => {
    if (
      !["post", "put", "patch"].includes((config.method || "").toLowerCase())
    ) {
      return config;
    }
    const now = Date.now();
    const reqObj = {
      url: config.url,
      data:
        typeof config.data === "object"
          ? JSON.stringify(config.data)
          : config.data,
      time: now,
    };
    let last = null;
    try {
      last = JSON.parse(sessionStorage.getItem(sessionKey) || "null");
    } catch {}
    if (
      last &&
      last.url === reqObj.url &&
      last.data === reqObj.data &&
      now - last.time < interval
    ) {
      onRepeat("数据正在处理，请勿重复提交", config);
      return Promise.reject(
        new PreventRepeatError("数据正在处理，请勿重复提交"),
      );
    }
    sessionStorage.setItem(sessionKey, JSON.stringify(reqObj));
    return config;
  });
}

export const preventRepeat = preventRepeatPlugin;
export default preventRepeatPlugin;
