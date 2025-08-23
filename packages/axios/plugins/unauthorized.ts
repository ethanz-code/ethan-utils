import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export interface UnauthorizedOptions {
  /**
   * 当收到未授权响应时的回调函数
   */
  onUnauthorized?: () => void;
  /**
   * 触发未授权回调的响应数据中的 code 值，默认为 401
   */
  unauthorizedCodes?: number | number[];
}

/**
 * 未授权处理插件
 * 支持检测 HTTP 状态码 401 和响应数据中的自定义 code 值
 */
export default function unauthorizedPlugin(
  api: AxiosInstance,
  options: UnauthorizedOptions = {},
) {
  const { onUnauthorized, unauthorizedCodes = 401 } = options;

  if (!onUnauthorized) {
    return;
  }

  const codes = Array.isArray(unauthorizedCodes)
    ? unauthorizedCodes
    : [unauthorizedCodes];

  // 成功响应拦截器 - 检查响应数据中的 code
  api.interceptors.response.use((response: AxiosResponse) => {
    if (
      response.data?.code !== undefined &&
      codes.includes(response.data.code)
    ) {
      onUnauthorized();
    }
    return response;
  }, undefined);

  // 错误响应拦截器 - 检查 HTTP 状态码 401
  api.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response?.status === 401) {
      onUnauthorized();
    }
    return Promise.reject(error);
  });
}
