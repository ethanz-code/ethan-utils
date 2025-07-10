import type { AxiosInstance, AxiosRequestConfig } from "axios";

export interface PreventRepeatOptions {
  interval?: number; // ms，默认 1000
  onRepeat?: (msg: string, config: AxiosRequestConfig) => void;
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
      return Promise.reject(new Error("数据正在处理，请勿重复提交"));
    }
    sessionStorage.setItem(sessionKey, JSON.stringify(reqObj));
    return config;
  });
}
