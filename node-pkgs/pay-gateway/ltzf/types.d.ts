declare global {
  namespace LTZF {
    namespace Params {
      /**
       * 支付通知API参数（这里面可选参数实际是不参与签名的）
       */
      export interface Notify {
        /** 支付结果，0成功1失败 */
        code: string;
        /** 时间戳 */
        timestamp: string;
        /** 商户号 */
        mch_id: string;
        /** 系统订单号 */
        order_no: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 支付平台订单号 */
        pay_no: string;
        /** 支付金额 */
        total_fee: string;
        /** 签名，非必填 */
        sign?: string;
        /** 支付渠道，非必填 */
        pay_channel?: string;
        /** 支付类型，非必填 */
        trade_type?: string;
        /** 支付完成时间，非必填 */
        success_time?: string;
        /** 附加数据，非必填 */
        attach?: string;
        /** 支付者信息，非必填 */
        openid?: string;
      }
      /**
       * 退款通知API参数（这里面可选参数实际是不参与签名的）
       */
      export interface RefundNotify {
        /** 支付结果，0成功1失败 */
        code: string;
        /** 时间戳 */
        timestamp: string;
        /** 商户号 */
        mch_id: string;
        /** 系统订单号 */
        order_no: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 支付平台订单号 */
        pay_no: string;
        /** 系统退款单号 */
        refund_no: string;
        /** 商户退款单号 */
        out_refund_no: string;
        /** 退款渠道，alipay/wxpay */
        pay_channel: string;
        /** 退款金额 */
        refund_fee: string;
        /** 签名，非必填 */
        sign?: string;
        /** 退款完成时间，非必填 */
        success_time?: string;
      }
      /**
       * 扫码支付API参数
       */
      export interface ScanPay {
        /** 商户号 */
        mch_id: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 支付金额 */
        total_fee: string;
        /** 商品描述 */
        body: string;
        /** 时间戳 */
        timestamp: string;
        /** 支付通知地址 */
        notify_url: string;
        /** 附加数据 */
        attach?: string;
        /** 订单失效时间 */
        time_expire?: string;
        /** 开发者应用ID */
        developer_appid?: string;
        /** 签名 */
        sign: string;
      }

      /**
       * H5支付API参数
       */
      export interface H5Pay {
        /** 商户号 */
        mch_id: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 支付金额 */
        total_fee: string;
        /** 商品描述 */
        body: string;
        /** 时间戳 */
        timestamp: string;
        /** 支付通知地址 */
        notify_url: string;
        /** 回跳地址 */
        return_url?: string;
        /** 附加数据 */
        attach?: string;
        /** 订单失效时间 */
        time_expire?: string;
        /** 开发者应用ID */
        developer_appid?: string;
        /** 签名 */
        sign: string;
      }

      /**
       * H5支付跳转API参数
       */
      export interface H5JumpPay {
        /** 商户号 */
        mch_id: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 支付金额 */
        total_fee: string;
        /** 商品描述 */
        body: string;
        /** 时间戳 */
        timestamp: string;
        /** 支付通知地址 */
        notify_url: string;
        /** 取消支付跳转地址 */
        quit_url?: string;
        /** 回跳地址 */
        return_url?: string;
        /** 附加数据 */
        attach?: string;
        /** 订单失效时间 */
        time_expire?: string;
        /** 开发者应用ID */
        developer_appid?: string;
        /** 签名 */
        sign: string;
      }

      /**
       * 公众号支付API（JSAPI支付）参数
       */
      export interface JsapiPay {
        /** 商户号 */
        mch_id: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 支付金额 */
        total_fee: string;
        /** 商品描述 */
        body: string;
        /** 用户Openid */
        openid: string;
        /** 时间戳 */
        timestamp: string;
        /** 支付通知地址 */
        notify_url: string;
        /** 签名 */
        sign: string;
        /** 回跳地址 */
        return_url?: string;
        /** 附加数据 */
        attach?: string;
        /** 订单失效时间 */
        time_expire?: string;
        /** 开发者应用ID */
        developer_appid?: string;
      }

      /**
       * 公众号支付便捷版API参数
       */
      export interface JsapiConvenient {
        /** 商户号 */
        mch_id: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 支付金额 */
        total_fee: string;
        /** 商品描述 */
        body: string;
        /** 时间戳 */
        timestamp: string;
        /** 支付通知地址 */
        notify_url: string;
        /** 回跳地址 */
        return_url?: string;
        /** 附加数据 */
        attach?: string;
        /** 订单失效时间 */
        time_expire?: string;
        /** 开发者应用ID */
        developer_appid?: string;
        /** 签名 */
        sign: string;
      }

      /**
       * APP支付API参数
       */
      export interface AppPay {
        /** 微信开放平台审核通过的移动应用appid */
        app_id: string;
        /** 商户号 */
        mch_id: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 支付金额 */
        total_fee: string;
        /** 商品描述 */
        body: string;
        /** 时间戳 */
        timestamp: string;
        /** 支付通知地址 */
        notify_url: string;
        /** 附加数据 */
        attach?: string;
        /** 订单失效时间 */
        time_expire?: string;
        /** 开发者应用ID */
        developer_appid?: string;
        /** 签名 */
        sign: string;
      }

      /**
       * 小程序支付API参数
       */
      export interface MiniProgramPay {
        /** 商户号 */
        mch_id: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 支付金额 */
        total_fee: string;
        /** 商品描述 */
        body: string;
        /** 时间戳 */
        timestamp: string;
        /** 支付通知地址 */
        notify_url: string;
        /** 附加数据 */
        attach?: string;
        /** 订单失效时间 */
        time_expire?: string;
        /** 开发者应用ID */
        developer_appid?: string;
        /** 小程序页面顶部标题 */
        title?: string;
        /** 签名 */
        sign: string;
      }

      /**
       * 订单退款API参数
       */
      export interface RefundOrder {
        /** 商户号 */
        mch_id: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 商户退款单号 */
        out_refund_no: string;
        /** 时间戳 */
        timestamp: string;
        /** 退款金额 */
        refund_fee: string;
        /** 退款描述 */
        refund_desc?: string;
        /** 退款通知地址 */
        notify_url?: string;
        /** 签名 */
        sign: string;
      }

      /**
       * 获取微信Openid API参数
       */
      export interface GetWechatOpenid {
        /** 商户号 */
        mch_id: string;
        /** 时间戳 */
        timestamp: string;
        /** 授权后回调地址 */
        callback_url: string;
        /** 附加数据 */
        attach?: string;
        /** 签名 */
        sign: string;
      }

      /**
       * 查询订单API参数
       */
      export interface GetPayOrder {
        /** 商户号 */
        mch_id: string;
        /** 商户订单号 */
        out_trade_no: string;
        /** 时间戳 */
        timestamp: string;
        /** 签名 */
        sign: string;
      }

      /**
       * 查询退款结果API参数
       */
      export interface GetRefundOrder {
        /** 商户号 */
        mch_id: string;
        /** 商户退款单号 */
        out_refund_no: string;
        /** 时间戳 */
        timestamp: string;
        /** 签名 */
        sign: string;
      }

      /**
       * 扫码支付业务入参类型
       */
      export type ScanPayInput = Omit<
        ScanPay,
        "mch_id" | "sign" | "developer_appid"
      > & {
        /** 支付通知地址，可选，不传则使用配置中的默认值 */
        notify_url?: string;
      };
      /**
       * H5支付业务入参类型
       */
      export type H5PayInput = Omit<
        H5Pay,
        "mch_id" | "sign" | "developer_appid"
      > & {
        /** 支付通知地址，可选，不传则使用配置中的默认值 */
        notify_url?: string;
        /** 回跳地址，可选，不传则使用配置中的默认值 */
        return_url?: string;
      };
      /**
       * H5支付跳转业务入参类型
       */
      export type H5JumpPayInput = Omit<
        H5JumpPay,
        "mch_id" | "sign" | "quit_url" | "developer_appid"
      > & {
        /** 支付通知地址，可选，不传则使用配置中的默认值 */
        notify_url?: string;
        /** 回跳地址，可选，不传则使用配置中的默认值 */
        return_url?: string;
      };
      /**
       * 公众号支付业务入参类型
       */
      export type JsapiPayInput = Omit<
        JsapiPay,
        "mch_id" | "sign" | "developer_appid"
      > & {
        /** 支付通知地址，可选，不传则使用配置中的默认值 */
        notify_url?: string;
        /** 回跳地址，可选，不传则使用配置中的默认值 */
        return_url?: string;
      };
      /**
       * 公众号支付便捷版业务入参类型
       */
      export type JsapiConvenientInput = Omit<
        JsapiConvenient,
        "mch_id" | "sign" | "developer_appid"
      > & {
        /** 支付通知地址，可选，不传则使用配置中的默认值 */
        notify_url?: string;
        /** 回跳地址，可选，不传则使用配置中的默认值 */
        return_url?: string;
      };
      /**
       * APP支付业务入参类型
       */
      export type AppPayInput = Omit<
        AppPay,
        "app_id" | "mch_id" | "sign" | "developer_appid"
      > & {
        /** 支付通知地址，可选，不传则使用配置中的默认值 */
        notify_url?: string;
      };
      /**
       * 小程序支付业务入参类型
       */
      export type MiniProgramPayInput = Omit<
        MiniProgramPay,
        "mch_id" | "sign" | "developer_appid"
      > & {
        /** 支付通知地址，可选，不传则使用配置中的默认值 */
        notify_url?: string;
      };
      /**
       * 订单退款业务入参类型
       */
      export type RefundOrderInput = Omit<RefundOrder, "mch_id" | "sign"> & {
        /** 退款通知地址，可选，不传则使用配置中的默认值 */
        notify_url?: string;
      };
      /**
       * 获取微信Openid业务入参类型
       */
      export type GetWechatOpenidInput = Omit<
        GetWechatOpenid,
        "mch_id" | "sign"
      >;
      /**
       * 查询订单业务入参类型
       */
      export type GetPayOrderInput = Omit<GetPayOrder, "mch_id" | "sign">;
      /**
       * 查询退款结果业务入参类型
       */
      export type GetRefundOrderInput = Omit<GetRefundOrder, "mch_id" | "sign">;
    }
    namespace Response {
      // 暂时保留空的接口定义，等待用户提供具体的响应类型
      export interface BaseResponse<T> {
        code: number;
        data: T;
        msg: string;
        request_id: string;
      }

      export interface ScanPay
        extends BaseResponse<{ code_url: string; QRcode_url: string }> {}
      export interface H5Pay extends BaseResponse<string> {}
      export interface H5JumpPay extends BaseResponse<string> {}
      export interface JsapiPay
        extends BaseResponse<{
          appId: string;
          timeStamp: string;
          nonceStr: string;
          package: string;
          signType: string;
          paySign: string;
        }> {}
      export interface JsapiConvenient
        extends BaseResponse<{
          order_url: string;
          QRcode_url: string;
        }> {}
      export interface AppPay
        extends BaseResponse<{
          appid: string;
          partnerid: string;
          prepayid: string;
          package: string;
          noncestr: string;
          timestamp: string;
          sign: string;
        }> {}
      export interface MiniProgramPay
        extends BaseResponse<{
          out_trade_no: string;
        }> {}
      export interface RefundOrder
        extends BaseResponse<{
          mch_id: string;
          out_trade_no: string;
          out_refund_no: string;
          order_no: string;
          pay_refund_no: string;
        }> {}
      export interface GetWechatOpenid extends BaseResponse<string> {}
      export interface GetPayOrder
        extends BaseResponse<{
          add_time: string;
          mch_id: string;
          order_no: string;
          out_trade_no: string;
          pay_no: string;
          body: string;
          total_fee: string;
          trade_type: string;
          success_time: string;
          attach: string;
          openid: string;
          pay_status: number;
        }> {}
      export interface GetRefundOrder
        extends BaseResponse<{
          refund_status: number;
          mch_id: string;
          out_trade_no: string;
          pay_no: string;
          order_no: string;
          out_refund_no: string;
          pay_refund_no: string;
          refund_fee: string;
          user_received_account: string;
          success_time: string;
        }> {}
    }
  }
}

// 导出 LTZF 命名空间
export type { LTZF };
