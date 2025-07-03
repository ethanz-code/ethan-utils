---
"@ethan-utils/axios": major
---

2.0 全新版本升级

Feature: 支持单例和多实例模式,通过 createRequest(options, isSingleton), 第二个参数用于控制是否单例或多实例;

Refactor:

1. 添加了 request 的缩写 -> r, 它与 request 功能一致;
2. 将 1.x 版本的非标准化响应结构, 例如: request.getWithoutBaseResponse 改为 request.getRaw 或 request.raw.get;
3. 向外导出了 axios 的 AxiosRequestConfig 类型, 封装的网络请求函数 (get, post, put, delete, patch 以及 .raw.get 等等那一套) 传入的 config 都是 AxiosRequestConfig;

Breaking Change:

1. 移除 initApiClient 初始化函数, 改为使用 createRequest;
2. 移除 request.withoutBaseResponse 系列获取非标准化响应结构的函数, 改为 request.raw.xx 或 request.xxRaw();
