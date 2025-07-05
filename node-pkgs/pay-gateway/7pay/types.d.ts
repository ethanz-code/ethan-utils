declare global {
  namespace SevenPay {
    namespace Params {
      /**
       * 页面跳转支付参数
       */
      export interface JumpPay {
        /** 商品名称，不超过100字 */
        name: string;
        /** 订单金额，最多保留两位小数 */
        money: string;
        /** 支付方式，alipay/wxpay */
        type: string;
        /** 订单编号，唯一 */
        out_trade_no: string;
        /** 异步通知页面，不支持带参数 */
        notify_url: string;
        /** 商户唯一标识 */
        pid: string;
        /** 支付渠道ID，可选 */
        cid?: string;
        /** 附加内容，可选 */
        param?: string;
        /** 跳转页面，交易完成后跳转，不支持带参数 */
        return_url: string;
        /** 签名 */
        sign?: string;
        /** 签名方法，默认为MD5 */
        sign_type?: "MD5";
      }
      /**
       * API接口支付参数
       */
      export interface ApiPay {
        /** 商户唯一标识 */
        pid: string;
        /** 支付渠道ID，可选 */
        cid?: string;
        /** 支付方式，alipay/wxpay */
        type: string;
        /** 订单编号，唯一 */
        out_trade_no: string;
        /** 异步通知页面，不支持带参数 */
        notify_url: string;
        /** 商品名称，不超过100字 */
        name: string;
        /** 订单金额，最多保留两位小数 */
        money: string;
        /** 客户端IP地址 */
        clientip: string;
        /** 设备类型，可选 */
        device?: string;
        /** 附加内容，可选 */
        param?: string;
        /** 签名 */
        sign?: string;
        /** 签名方法，默认为MD5 */
        sign_type?: "MD5";
      }
      /**
       * 余额查询参数
       */
      export interface BalanceQuery {
        /** 操作类型，固定为balance */
        act: "balance";
        /** 商户唯一标识 */
        pid: string;
        /** 商户密钥 */
        key: string;
      }
      /**
       * 订单查询参数
       */
      export interface OrderQuery {
        /** 操作类型，固定为order */
        act: "order";
        /** 商户唯一标识 */
        pid: string;
        /** 商户密钥 */
        key: string;
        /** 平台订单号，可选 */
        trade_no?: string;
        /** 商户订单号，可选 */
        out_trade_no?: string;
      }
      /**
       * 退款参数
       */
      export interface Refund {
        /** 操作类型，固定为refund */
        act: "refund";
        /** 商户唯一标识 */
        pid: string;
        /** 商户密钥 */
        key: string;
        /** 平台订单号，可选 */
        trade_no?: string;
        /** 商户订单号，可选 */
        out_trade_no?: string;
        /** 退款金额，最多保留两位小数 */
        money: string;
      }
      /**
       * 支付结果通知参数
       */
      export interface Notify {
        pid: string;
        name: string;
        money: string;
        out_trade_no: string;
        trade_no: string;
        param?: string;
        trade_status: string;
        type: string;
        sign: string;
        sign_type: "MD5";
      }
      /**
       * 页面跳转支付业务入参类型
       */
      export type JumpPayInput = Omit<
        JumpPay,
        "pid" | "cid" | "notify_url" | "return_url" | "sign" | "sign_type"
      >;
      /**
       * API接口支付业务入参类型
       */
      export type ApiPayInput = Omit<
        ApiPay,
        "pid" | "cid" | "notify_url" | "sign" | "sign_type"
      >;
      /**
       * 余额查询业务入参类型
       */
      export type BalanceQueryInput = Omit<BalanceQuery, "pid" | "key" | "act">;
      /**
       * 订单查询业务入参类型
       */
      export type OrderQueryInput = Omit<OrderQuery, "pid" | "key" | "act">;
      /**
       * 退款业务入参类型
       */
      export type RefundInput = Omit<Refund, "pid" | "key" | "act">;
      /**
       * 支付结果通知验签业务入参类型
       */
      export type NotifyInput = Omit<Notify, "pid" | "sign" | "sign_type">;
    }
    namespace Response {
      /**
       * API接口支付响应
       */
      export interface ApiPay {
        code: number;
        msg: string;
        O_id?: string;
        trade_no?: string;
        payurl?: string;
        qrcode?: string;
        img?: string;
      }
      /**
       * 余额查询响应
       */
      export interface BalanceQuery {
        code: number;
        msg: string;
        balance?: string;
      }
      /**
       * 订单查询响应
       */
      export interface OrderQuery {
        code: number;
        msg: string;
        trade_no?: string;
        out_trade_no?: string;
        type?: string;
        pid?: string;
        addtime?: string;
        endtime?: string;
        name?: string;
        money?: string;
        status?: number;
        param?: string;
        buyer?: string;
      }
      /**
       * 退款响应
       */
      export interface Refund {
        code: number;
        msg: string;
      }
      /**
       * 支付结果通知响应
       */
      export type Notify = "success" | string;
    }
  }
}

export {};
