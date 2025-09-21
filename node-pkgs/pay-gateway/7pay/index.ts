import CryptoJS from "crypto-js";
import { createRequest } from "@ethan-utils/axios";

/**
 * 7pay 全局配置类型
 * @property {string} baseURL - API基础地址，必填
 * @property {string} key - 商户密钥，必填
 * @property {string} pid - 商户ID，必填
 * @property {string} [cid] - 支付渠道ID，可选
 * @property {string} notify_url - 支付结果通知回调地址，必填
 * @property {string} return_url - 支付完成后跳转地址，必填
 * @property {number} [timeout] - 请求超时时间（毫秒），可选，默认 10000
 * @property {boolean} [log] - 是否输出日志，默认 true
 */
export interface SevenPayConfig {
  /** API基础地址，必填 */
  baseURL: string;
  /** 商户密钥，必填 */
  key: string;
  /** 商户ID，必填 */
  pid: string;
  /** 支付渠道ID，可选 */
  cid?: string;
  /** 支付结果通知回调地址，必填 */
  notify_url: string;
  /** 支付完成后跳转地址，必填 */
  return_url: string;
  /** 请求超时时间（毫秒），可选，默认 10000 */
  timeout?: number;
  /** 是否输出日志，默认 true */
  log?: boolean;
}

// 全局 sevenPayApi 实例和配置
let sevenPayApi: ReturnType<typeof createRequest>;
let sevenPayConfig: SevenPayConfig;

// 统一未初始化报错信息
const SEVENPAY_NOT_INIT_ERROR_MSG =
  "7pay 未初始化或未配置 key/pid，请先调用 setSevenPayApiConfig";

/**
 * 初始化 7pay API 配置
 * @param {SevenPayConfig} config - 配置信息，包含密钥、商户ID等
 */
export function setSevenPayApiConfig(config: SevenPayConfig) {
  const baseURL = config.baseURL;
  sevenPayConfig = {
    ...config,
    baseURL,
    notify_url: config.notify_url,
    return_url: config.return_url,
    log: config.log !== false, // 默认为 true
  };
  sevenPayApi = createRequest({
    baseURL: baseURL,
    timeout: config.timeout,
  });
  // 工具函数：隐藏密钥中间部分
  function maskKey(key: string) {
    if (!key || key.length <= 4) return "****";
    return key.slice(0, 2) + "*".repeat(key.length - 4) + key.slice(-2);
  }
  if (sevenPayConfig.log) {
    console.log("【7pay】配置初始化成功:", {
      baseURL: baseURL,
      key: maskKey(config.key),
      pid: config.pid,
      timeout: config.timeout,
      notify_url: config.notify_url,
      return_url: config.return_url,
    });
    console.warn(
      "【7pay warn】config 项（如 pid、cid、notify_url、return_url 等）无需在业务函数重复传参，SDK 已自动处理，即使文档标注必填也无需重复填写。",
    );
  }
}

// 内部校验配置函数
function ensureSevenPayConfig(): boolean {
  if (
    !sevenPayApi ||
    !sevenPayConfig ||
    !sevenPayConfig.key ||
    !sevenPayConfig.pid
  ) {
    // 统一不再打印 warn，直接返回 false
    return false;
  }
  return true;
}

// 签名参数过滤工具函数
function filterSignParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(
        ([k, v]) =>
          k !== "sign" &&
          k !== "sign_type" &&
          v !== undefined &&
          v !== null &&
          v !== "",
      )
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

/**
 * 7pay 签名算法
 * @param params - 参与签名的参数对象
 * @param key - 商户密钥
 * @returns 签名字符串（小写）
 */
function signParams(params: Record<string, any>, key: string): string {
  // 过滤并排序参数
  const filtered = filterSignParams(params);
  // 拼接 a=b&c=d
  const paramString = Object.entries(filtered)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  // 拼接密钥
  const stringToSign = paramString + key;
  // MD5小写
  return CryptoJS.MD5(stringToSign).toString(CryptoJS.enc.Hex).toLowerCase();
}

/**
 * 页面跳转支付（拼接url跳转）
 * @param params 跳转支付参数
 * @returns 拼接好的 url
 */
export function jumpPay(params: SevenPay.Params.JumpPayInput): string {
  if (!ensureSevenPayConfig()) throw new Error(SEVENPAY_NOT_INIT_ERROR_MSG);
  // 自动补全参数
  const fullParams: SevenPay.Params.JumpPay = {
    ...params,
    pid: sevenPayConfig.pid,
    cid: sevenPayConfig.cid,
    notify_url: sevenPayConfig.notify_url,
    return_url: sevenPayConfig.return_url,
    sign_type: "MD5",
    sign: "",
  };
  // 生成签名
  fullParams.sign = signParams(
    filterSignParams({ ...fullParams, sign: undefined, sign_type: undefined }),
    sevenPayConfig.key,
  );
  // 拼接 url
  const url = sevenPayConfig.baseURL.endsWith("/")
    ? sevenPayConfig.baseURL + "submit.php"
    : sevenPayConfig.baseURL + "/submit.php";
  const query = Object.entries(fullParams)
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join("&");
  return `${url}?${query}`;
}

/**
 * API接口支付（form-data POST）
 * @param params - API支付参数
 * @returns Promise<SevenPay.Response.ApiPay>
 */
export async function apiPay(
  params: SevenPay.Params.ApiPayInput,
): Promise<SevenPay.Response.ApiPay> {
  if (!ensureSevenPayConfig()) throw new Error(SEVENPAY_NOT_INIT_ERROR_MSG);
  const fullParams: SevenPay.Params.ApiPay = {
    ...params,
    pid: sevenPayConfig.pid,
    cid: sevenPayConfig.cid,
    notify_url: sevenPayConfig.notify_url,
    sign_type: "MD5",
    sign: "",
  };
  fullParams.sign = signParams(
    filterSignParams({ ...fullParams, sign: undefined, sign_type: undefined }),
    sevenPayConfig.key,
  );
  const urlParams = new URLSearchParams();
  Object.entries(fullParams).forEach(([k, v]) =>
    urlParams.append(k, String(v)),
  );
  const res = await sevenPayApi.post<SevenPay.Response.ApiPay>(
    "/mapi.php",
    urlParams,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
  return res;
}

/**
 * 余额查询
 * @returns Promise<SevenPay.Response.BalanceQuery>
 */
export async function balanceQuery(): Promise<SevenPay.Response.BalanceQuery> {
  if (!ensureSevenPayConfig()) throw new Error(SEVENPAY_NOT_INIT_ERROR_MSG);
  const query = {
    act: "balance",
    pid: sevenPayConfig.pid,
    key: sevenPayConfig.key,
  };
  const res = await sevenPayApi.get<SevenPay.Response.BalanceQuery>(
    "/api.php",
    { params: query },
  );
  return res;
}

/**
 * 订单查询
 * @param params - 订单查询参数
 * @returns Promise<SevenPay.Response.OrderQuery>
 */
export async function orderQuery(
  params: SevenPay.Params.OrderQueryInput,
): Promise<SevenPay.Response.OrderQuery> {
  if (!ensureSevenPayConfig()) throw new Error(SEVENPAY_NOT_INIT_ERROR_MSG);
  const query: SevenPay.Params.OrderQuery = {
    act: "order",
    pid: sevenPayConfig.pid,
    key: sevenPayConfig.key,
    ...params,
  };
  const res = await sevenPayApi.get<SevenPay.Response.OrderQuery>("/api.php", {
    params: query,
  });
  return res;
}

/**
 * 退款
 * @param params - 退款参数
 * @returns Promise<SevenPay.Response.Refund>
 */
export async function refund(
  params: SevenPay.Params.RefundInput,
): Promise<SevenPay.Response.Refund> {
  if (!ensureSevenPayConfig()) throw new Error(SEVENPAY_NOT_INIT_ERROR_MSG);
  const allParams: SevenPay.Params.Refund = {
    act: "refund",
    pid: sevenPayConfig.pid,
    key: sevenPayConfig.key,
    ...params,
  };
  const urlParams = new URLSearchParams();
  Object.entries(allParams).forEach(([k, v]) => {
    if (v !== undefined) urlParams.append(k, String(v));
  });
  const res = await sevenPayApi.post<SevenPay.Response.Refund>(
    "/api.php?act=refund",
    urlParams,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
  return res;
}

/**
 * 通知相关工具
 */
export const notify = {
  /**
   * 校验支付结果通知参数签名
   * @param params - 通知参数
   * @returns {boolean} 验签是否通过
   */
  verifyPayParams(params: SevenPay.Params.Notify): boolean {
    return verifyNotify(params);
  },
};

/**
 * 支付结果通知验签
 * @param params - 通知参数
 * @returns 验签是否通过
 */
function verifyNotify(params: SevenPay.Params.Notify): boolean {
  if (!ensureSevenPayConfig()) throw new Error(SEVENPAY_NOT_INIT_ERROR_MSG);
  // 只用过滤后的参数参与签名
  const filtered = filterSignParams(params);
  const signStr = signParams(filtered, sevenPayConfig.key);
  return signStr === params.sign;
}
