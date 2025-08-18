import CryptoJS from "crypto-js";
import { createRequest } from "@ethan-utils/axios";

/**
 * ltzf 全局配置类型
 * @property {string} baseURL - API基础地址，必填
 * @property {string} key - 商户密钥，必填
 * @property {string} mch_id - 商户号，必填
 * @property {string} notifyUrl - 支付通知地址，必填
 * @property {string} returnUrl - 回跳地址，必填
 * @property {string} [refundUrl] - 退款通知地址，可选
 * @property {string} [developerAppid] - 开发者应用ID，可选
 * @property {number} [timeout] - 请求超时时间（毫秒），可选，默认 10000
 * @property {Record<string, string[]>} [signFilter] - 自定义签名字段过滤，谨慎使用，可选
 * @property {boolean} [log] - 是否输出日志，默认 true
 */
export interface LtzfConfig {
  /** API基础地址，必填 */
  baseURL: string;
  /** 商户密钥，必填 */
  key: string;
  /** 商户号，必填 */
  mch_id: string;
  /** 支付通知地址，必填 */
  notifyUrl: string;
  /** 回跳地址，必填 */
  returnUrl: string;
  /** 退款通知地址，可选 */
  refundUrl?: string;
  /** 开发者应用ID，可选 */
  developerAppid?: string;
  /** 请求超时时间（毫秒），可选，默认 10000 */
  timeout?: number;
  /** 自定义签名字段过滤，谨慎使用，可选 */
  signFilter?: Record<string, string[]>;
  /** 是否输出日志，默认 true */
  log?: boolean;
}

// 全局ltzfApi实例
let ltzfApi: ReturnType<typeof createRequest>;
let ltzfConfig: LtzfConfig;

// 1. 类型约束
const LTZF_API_NAMES = [
  "scanPay",
  "h5Pay",
  "h5JumpPay",
  "jsapiPay",
  "jsapiConvenient",
  "appPay",
  "miniProgramPay",
  "refundOrder",
  "getWechatOpenid",
  "getPayOrder",
  "getRefundOrder",
  "notify",
  "refundNotify",
] as const;
type LtzfApiName = (typeof LTZF_API_NAMES)[number];
const LTZF_FIELD_NAMES = [
  "mch_id",
  "out_trade_no",
  "total_fee",
  "body",
  "timestamp",
  "notify_url",
  "openid",
  "app_id",
  "developer_appid",
  "quit_url",
  "return_url",
  "out_refund_no",
  "refund_fee",
  "order_no",
  "pay_no",
  "refund_no",
  "pay_channel",
  "code",
  "callback_url",
] as const;
type LtzfFieldName = (typeof LTZF_FIELD_NAMES)[number];
interface SignFieldWhitelistItem {
  api: LtzfApiName;
  fields: LtzfFieldName[];
}

// 2. 白名单配置
const SIGN_FIELD_WHITELIST: SignFieldWhitelistItem[] = [
  {
    api: "scanPay",
    fields: [
      "mch_id",
      "out_trade_no",
      "total_fee",
      "body",
      "timestamp",
      "notify_url",
    ],
  },
  {
    api: "h5Pay",
    fields: [
      "mch_id",
      "out_trade_no",
      "total_fee",
      "body",
      "timestamp",
      "notify_url",
    ],
  },
  {
    api: "h5JumpPay",
    fields: [
      "mch_id",
      "out_trade_no",
      "total_fee",
      "body",
      "timestamp",
      "notify_url",
    ],
  },
  {
    api: "jsapiPay",
    fields: [
      "mch_id",
      "out_trade_no",
      "total_fee",
      "body",
      "openid",
      "timestamp",
      "notify_url",
    ],
  },
  {
    api: "jsapiConvenient",
    fields: [
      "mch_id",
      "out_trade_no",
      "total_fee",
      "body",
      "timestamp",
      "notify_url",
    ],
  },
  {
    api: "appPay",
    fields: [
      "app_id",
      "mch_id",
      "out_trade_no",
      "total_fee",
      "body",
      "timestamp",
      "notify_url",
    ],
  },
  {
    api: "miniProgramPay",
    fields: [
      "mch_id",
      "out_trade_no",
      "total_fee",
      "body",
      "timestamp",
      "notify_url",
    ],
  },
  {
    api: "refundOrder",
    fields: [
      "mch_id",
      "out_trade_no",
      "out_refund_no",
      "timestamp",
      "refund_fee",
    ],
  },
  {
    api: "getWechatOpenid",
    fields: ["mch_id", "timestamp", "callback_url"],
  },
  {
    api: "getPayOrder",
    fields: ["mch_id", "out_trade_no", "timestamp"],
  },
  {
    api: "getRefundOrder",
    fields: ["mch_id", "out_refund_no", "timestamp"],
  },
  {
    api: "notify",
    fields: [
      "code",
      "timestamp",
      "mch_id",
      "order_no",
      "out_trade_no",
      "pay_no",
      "total_fee",
    ],
  },
  {
    api: "refundNotify",
    fields: [
      "code",
      "timestamp",
      "mch_id",
      "order_no",
      "out_trade_no",
      "pay_no",
      "refund_no",
      "out_refund_no",
      "pay_channel",
      "refund_fee",
    ],
  },
];

// 用户自定义签名字段过滤配置
let userSignFilter: Record<string, string[]> = {};

// 统一未初始化报错信息
const LTZF_NOT_INIT_ERROR_MSG =
  "ltzf 未初始化或未配置 key，请先调用 setLtzfApiConfig";

/**
 * 初始化蓝兔支付API配置
 * @param {LtzfConfig} config - 配置信息，包含密钥、通知地址等
 */
export function setLtzfApiConfig(config: LtzfConfig) {
  ltzfConfig = {
    ...config,
    log: config.log !== false, // 默认为 true
  };
  ltzfApi = createRequest({
    baseURL: config.baseURL,
    timeout: config.timeout,
  });
  // 工具函数：隐藏密钥中间部分
  function maskKey(key: string) {
    if (!key || key.length <= 4) return "****";
    return key.slice(0, 2) + "*".repeat(key.length - 4) + key.slice(-2);
  }
  if (ltzfConfig.signFilter) {
    userSignFilter = ltzfConfig.signFilter;
    if (ltzfConfig.log) {
      console.warn(
        "【ltzf warn】已启用自定义签名字段过滤，请确保安全性和正确性！",
      );
    }
  }
  if (ltzfConfig.log) {
    console.log("【ltzf】配置初始化成功:", {
      baseURL: config.baseURL,
      key: maskKey(config.key),
      notifyUrl: config.notifyUrl,
      refundUrl: config.refundUrl,
      returnUrl: config.returnUrl,
      developerAppid: config.developerAppid,
      timeout: config.timeout,
      signFilter: !!config.signFilter,
    });
    console.warn(
      "【ltzf warn】config 项（如 mch_id、notifyUrl、returnUrl 等）无需在业务函数重复传参，SDK 已自动处理，即使文档标注必填也无需重复填写。",
    );
  }
}

// 通用签名参数过滤
function filterSignParams(params: Record<string, any>, api: string) {
  // 获取签名字段白名单
  function getSignFields(api: string): string[] {
    if (userSignFilter[api]) return userSignFilter[api];
    const found = SIGN_FIELD_WHITELIST.find((item) => item.api === api);
    return found ? found.fields : [];
  }
  const fields = getSignFields(api);
  const filtered: Record<string, any> = {};
  for (const key of fields) {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      filtered[key] = params[key];
    }
  }
  return filtered;
}

// 内部校验配置函数
function ensureLtzfConfig(): boolean {
  if (!ltzfApi || !ltzfConfig || !ltzfConfig.key) {
    throw new Error(LTZF_NOT_INIT_ERROR_MSG);
  }
  return true;
}

/**
 * 蓝兔支付签名算法封装
 * @param {Record<string, any>} params - 参与签名的参数对象
 * @returns {string} 签名字符串
 */
export function signParams(params: Record<string, any>): string {
  // 1. 确保配置已初始化
  ensureLtzfConfig();
  // 2. 排除 sign 字段，只参与必填参数
  const filtered = Object.fromEntries(
    Object.entries(params).filter(
      ([k, v]) => k !== "sign" && v !== undefined && v !== null && v !== "",
    ),
  );
  // 3. 排序参数
  const sortedKeys = Object.keys(filtered).sort();
  // 4. 拼接 key=value 形式
  const paramString = sortedKeys.map((k) => `${k}=${filtered[k]}`).join("&");
  // 5. 根据配置获取密钥
  const key = ltzfConfig.key;
  // 6. 拼接密钥
  const stringToSign = `${paramString}&key=${key}`;
  // 7. MD5 加密并转大写
  return CryptoJS.MD5(stringToSign).toString().toUpperCase();
}

/**
 * 通知相关工具
 */
export const notify = {
  /**
   * 校验支付通知参数签名
   * @param params - 支付通知参数
   * @returns {boolean} 签名是否有效
   */
  verifyPayParams(params: LTZF.Params.Notify): boolean {
    return verifyNotifyParams(params);
  },
  /**
   * 校验退款通知参数签名
   * @param params - 退款通知参数
   * @returns {boolean} 签名是否有效
   */
  verifyRefundParams(params: LTZF.Params.RefundNotify): boolean {
    return verifyRefundNotifyParams(params);
  },
};

// 校验支付通知参数签名
function verifyNotifyParams(params: LTZF.Params.Notify): boolean {
  ensureLtzfConfig();
  if (!params.sign) return false;
  const filtered = filterSignParams(params, "notify");
  const sign = signParams(filtered);
  return (
    sign === params.sign ||
    sign === params.sign.toUpperCase() ||
    sign === params.sign.toLowerCase()
  );
}

// 校验退款通知参数签名
function verifyRefundNotifyParams(params: LTZF.Params.RefundNotify): boolean {
  ensureLtzfConfig();
  if (!params.sign) return false;
  const filtered = filterSignParams(params, "refundNotify");
  const sign = signParams(filtered);
  return (
    sign === params.sign ||
    sign === params.sign.toUpperCase() ||
    sign === params.sign.toLowerCase()
  );
}

/**
 * 扫码支付API请求方法
 * @param {LTZF.Params.ScanPayInput} params - 扫码支付参数
 * @returns {Promise<LTZF.Response.ScanPay>} 支付结果
 */
export async function scanPay(params: LTZF.Params.ScanPayInput) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const notify_url = ltzfConfig.notifyUrl;
  const developer_appid = ltzfConfig.developerAppid;
  const filteredParams = filterSignParams(
    { ...params, mch_id, notify_url, developer_appid },
    "scanPay",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    notify_url,
    developer_appid,
    sign,
  };
  return ltzfApi.post<LTZF.Response.ScanPay>("/api/wxpay/native", reqParams);
}

/**
 * H5支付API请求方法
 * @param {LTZF.Params.H5PayInput} params - H5支付参数
 * @returns {Promise<LTZF.Response.H5Pay>} 支付结果
 */
export async function h5Pay(params: LTZF.Params.H5PayInput) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const notify_url = ltzfConfig.notifyUrl;
  const developer_appid = ltzfConfig.developerAppid;
  const return_url = ltzfConfig.returnUrl;
  const filteredParams = filterSignParams(
    { ...params, mch_id, notify_url, developer_appid, return_url },
    "h5Pay",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    notify_url,
    developer_appid,
    return_url,
    sign,
  };
  return ltzfApi.post<LTZF.Response.H5Pay>("/api/wxpay/wap", reqParams);
}

/**
 * H5支付跳转API请求方法
 * @param {LTZF.Params.H5JumpPayInput} params - H5跳转支付参数
 * @returns {Promise<LTZF.Response.H5JumpPay>} 支付结果
 */
export async function h5JumpPay(params: LTZF.Params.H5JumpPayInput) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const notify_url = ltzfConfig.notifyUrl;
  const developer_appid = ltzfConfig.developerAppid;
  const quit_url = undefined;
  const return_url = ltzfConfig.returnUrl;
  const filteredParams = filterSignParams(
    {
      ...params,
      mch_id,
      notify_url,
      developer_appid,
      quit_url,
      return_url,
    },
    "h5JumpPay",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    notify_url,
    developer_appid,
    quit_url,
    return_url,
    sign,
  };
  return ltzfApi.post<LTZF.Response.H5JumpPay>("/api/wxpay/jump_h5", reqParams);
}

/**
 * 公众号支付API（JSAPI支付）请求方法
 * @param {LTZF.Params.JsapiPayInput} params - 公众号支付参数
 * @returns {Promise<LTZF.Response.JsapiPay>} 支付结果
 */
export async function jsapiPay(params: LTZF.Params.JsapiPayInput) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const notify_url = ltzfConfig.notifyUrl;
  const developer_appid = ltzfConfig.developerAppid;
  const return_url = ltzfConfig.returnUrl;
  const filteredParams = filterSignParams(
    {
      ...params,
      mch_id,
      notify_url,
      developer_appid,
      return_url,
    },
    "jsapiPay",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    notify_url,
    developer_appid,
    return_url,
    sign,
  };
  return ltzfApi.post<LTZF.Response.JsapiPay>("/api/wxpay/jsapi", reqParams);
}

/**
 * 公众号支付便捷版API请求方法
 * @param {LTZF.Params.JsapiConvenientInput} params - 便捷版公众号支付参数
 * @returns {Promise<LTZF.Response.JsapiConvenient>} 支付结果
 */
export async function jsapiConvenientPay(
  params: LTZF.Params.JsapiConvenientInput,
) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const notify_url = ltzfConfig.notifyUrl;
  const developer_appid = ltzfConfig.developerAppid;
  const return_url = ltzfConfig.returnUrl;
  const filteredParams = filterSignParams(
    {
      ...params,
      mch_id,
      notify_url,
      developer_appid,
      return_url,
    },
    "jsapiConvenient",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    notify_url,
    developer_appid,
    return_url,
    sign,
  };
  return ltzfApi.post<LTZF.Response.JsapiConvenient>(
    "/api/wxpay/jsapi_convenient",
    reqParams,
  );
}

/**
 * APP支付API请求方法
 * @param {LTZF.Params.AppPayInput} params - APP支付参数
 * @returns {Promise<LTZF.Response.AppPay>} 支付结果
 */
export async function appPay(params: LTZF.Params.AppPayInput) {
  ensureLtzfConfig();
  const notify_url = ltzfConfig.notifyUrl;
  const developer_appid = ltzfConfig.developerAppid;
  const mch_id = ltzfConfig.mch_id;
  const filteredParams = filterSignParams(
    {
      ...params,
      notify_url,
      developer_appid,
      mch_id,
    },
    "appPay",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    notify_url,
    developer_appid,
    mch_id,
    sign,
  };
  return ltzfApi.post<LTZF.Response.AppPay>("/api/wxpay/app", reqParams);
}

/**
 * 小程序支付API请求方法
 * @param {LTZF.Params.MiniProgramPayInput} params - 小程序支付参数
 * @returns {Promise<LTZF.Response.MiniProgramPay>} 支付结果
 */
export async function miniProgramPay(params: LTZF.Params.MiniProgramPayInput) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const notify_url = ltzfConfig.notifyUrl;
  const developer_appid = ltzfConfig.developerAppid;
  const filteredParams = filterSignParams(
    {
      ...params,
      mch_id,
      notify_url,
      developer_appid,
    },
    "miniProgramPay",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    notify_url,
    developer_appid,
    sign,
  };
  return ltzfApi.post<LTZF.Response.MiniProgramPay>(
    "/api/wxpay/miniprogram",
    reqParams,
  );
}

/**
 * 订单退款API请求方法
 * @param {LTZF.Params.RefundOrderInput} params - 退款参数
 * @returns {Promise<LTZF.Response.RefundOrder>} 退款结果
 */
export async function refundOrder(params: LTZF.Params.RefundOrderInput) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const notify_url = ltzfConfig.refundUrl;
  const filteredParams = filterSignParams(
    {
      ...params,
      mch_id,
      notify_url,
    },
    "refundOrder",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    notify_url,
    sign,
  };
  return ltzfApi.post<LTZF.Response.RefundOrder>(
    "/api/wxpay/refund_order",
    reqParams,
  );
}

/**
 * 获取微信Openid API请求方法
 * @param {LTZF.Params.GetWechatOpenidInput} params - 获取Openid参数
 * @returns {Promise<LTZF.Response.GetWechatOpenid>} 授权链接
 */
export async function getWechatOpenid(
  params: LTZF.Params.GetWechatOpenidInput,
) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const filteredParams = filterSignParams(
    { ...params, mch_id },
    "getWechatOpenid",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    sign,
  };
  return ltzfApi.post<LTZF.Response.GetWechatOpenid>(
    "/api/wxpay/get_wechat_openid",
    reqParams,
  );
}

/**
 * 查询订单API请求方法
 * @param {LTZF.Params.GetPayOrderInput} params - 查询订单参数
 * @returns {Promise<LTZF.Response.GetPayOrder>} 订单信息
 */
export async function getPayOrder(params: LTZF.Params.GetPayOrderInput) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const filteredParams = filterSignParams({ ...params, mch_id }, "getPayOrder");
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    sign,
  };
  return ltzfApi.post<LTZF.Response.GetPayOrder>(
    "/api/wxpay/get_pay_order",
    reqParams,
  );
}

/**
 * 查询退款结果API请求方法
 * @param {LTZF.Params.GetRefundOrderInput} params - 查询退款参数
 * @returns {Promise<LTZF.Response.GetRefundOrder>} 退款信息
 */
export async function getRefundOrder(params: LTZF.Params.GetRefundOrderInput) {
  ensureLtzfConfig();
  const mch_id = ltzfConfig.mch_id;
  const filteredParams = filterSignParams(
    { ...params, mch_id },
    "getRefundOrder",
  );
  const sign = signParams(filteredParams);
  const reqParams = {
    ...params,
    mch_id,
    sign,
  };
  return ltzfApi.post<LTZF.Response.GetRefundOrder>(
    "/api/wxpay/get_refund_order",
    reqParams,
  );
}
