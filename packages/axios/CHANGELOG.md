# @ethan-utils/axios

## 2.3.1

### Patch Changes

- 92bcb32: feat(axios): add customizable unauthorized codes support

## 2.3.0

### Minor Changes

- 7edaf26: refactor(axios)：改进令牌处理和重试逻辑
  - 将标记注入从静态头移至请求拦截器，以便动态处理
  - 更新重试条件，明确检查网络错误、可重试错误和 5xx 状态代码
  - 更新文档以明确令牌格式预期

## 2.2.0

### Minor Changes

- 2f1a474: 修改基础响应结构 msg -> message

## 2.1.0

### Minor Changes

- 08ffbee: 新增插件支持内置了两个插件可供使用：limitBodySize 和 preventRepeat，详见 README.md

  Plugin support added, with two built-in plugins available: limitBodySize and preventRepeat. See README.md for details.

## 2.0.1

### Patch Changes

- dbeaaa7: 更新文档和注释

## 2.0.0

### Major Changes

- 92e854d: 2.0 全新版本升级

  Feature: 支持单例和多实例模式,通过 createRequest(options, isSingleton), 第二个参数用于控制是否单例或多实例;

  Refactor:
  1. 添加了 request 的缩写 -> r, 它与 request 功能一致;
  2. 将 1.x 版本的非标准化响应结构, 例如: request.getWithoutBaseResponse 改为 request.getRaw 或 request.raw.get;
  3. 向外导出了 axios 的 AxiosRequestConfig 类型, 封装的网络请求函数 (get, post, put, delete, patch 以及 .raw.get 等等那一套) 传入的 config 都是 AxiosRequestConfig;

  Breaking Change:
  1. 移除 initApiClient 初始化函数, 改为使用 createRequest;
  2. 移除 request.withoutBaseResponse 系列获取非标准化响应结构的函数, 改为 request.raw.xx 或 request.xxRaw();

## 1.0.2

### Patch Changes

- a622d85: Update package.json keywords

## 1.0.1

### Patch Changes

- 24c90a3: Update README, replace the wrong import package name

## 1.0.0

### Major Changes

- dc455a9: Initial Release
