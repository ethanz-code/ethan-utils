import type { AxiosInstance, AxiosRequestConfig } from "axios";

export interface LimitBodySizeOptions {
  maxBodySize?: number; // 单位：字节，默认 5MB
  onLimit?: (msg: string, config: AxiosRequestConfig) => void;
}

export function limitBodySizePlugin(
  api: AxiosInstance,
  options: LimitBodySizeOptions = {},
) {
  const maxBodySize = options.maxBodySize ?? 5 * 1024 * 1024;
  const onLimit =
    options.onLimit ??
    ((msg) => {
      console.warn(msg);
    });

  api.interceptors.request.use((config) => {
    if (
      ["post", "put", "patch"].includes((config.method || "").toLowerCase())
    ) {
      let size = 0;
      if (config.data) {
        if (typeof config.data === "string") {
          size = new Blob([config.data]).size;
        } else {
          size = new Blob([JSON.stringify(config.data)]).size;
        }
      }
      if (size > maxBodySize) {
        onLimit(
          `请求体大小超出限制：${(size / 1024 / 1024).toFixed(2)}MB > ${(maxBodySize / 1024 / 1024).toFixed(2)}MB`,
          config,
        );
        return Promise.reject(new Error("请求体大小超出限制"));
      }
    }
    return config;
  });
}

export const limitBodySize = limitBodySizePlugin;
export default limitBodySizePlugin;
