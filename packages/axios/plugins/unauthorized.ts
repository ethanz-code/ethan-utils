import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";

export interface UnauthorizedOptions {
  /**
   * 当收到未授权响应时的回调函数
   */
  onUnauthorized?: () => void;
  /**
   * 触发未授权回调的响应数据中的 code 值，默认为 1001
   */
  unauthorizedCodes?: number | number[];
}

/**
 * 未授权处理插件
 * 支持检测 HTTP 状态码 401 和 403 以及响应数据中的自定义 code 值
 */
export function unauthorizedPlugin(
  api: AxiosInstance,
  options: UnauthorizedOptions = {},
) {
  const { onUnauthorized, unauthorizedCodes = 1001 } = options;

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

  // 错误响应拦截器 - 检查 HTTP 状态码 401 或 403
  api.interceptors.response.use(undefined, (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      onUnauthorized();
    }
    return Promise.reject(error);
  });
}

export const unauthorized = unauthorizedPlugin;
export default unauthorizedPlugin;
