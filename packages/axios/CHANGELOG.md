# @ethan-utils/axios

## 2.7.0

### Minor Changes

- 9eaac09: feat: 暴露底层 axios 实例 (request.instance) 以支持自定义拦截器
  docs: 更新 README.md 和 package.json 配置

## 2.6.0

### Minor Changes

- d7d35ae: 更新 std.post std.xx 请求方式作为自带封装 BaseResponse 的方式, .post .xx 作为普通请求方式,传入什么类型就返回什么类型.

## 2.5.1

### Patch Changes

- 9792759: 优化重复请求插件逻辑

## 2.5.0

### Minor Changes

- d738b2c: 更新事项:
  1. 尝试修复 重复请求插件无法阻止重复请求的问题
  2. 新增 direct 方法，直接返回后端数据，适用于非标准 BaseResponse 格式

## 2.4.3

### Patch Changes

- 083f55c: 尝试修复无法使用插件问题

## 2.4.2

### Patch Changes

- 1fed9b3: 尝试修复导入插件相关问题

## 2.4.1

### Patch Changes

- 81d2740: 修复无法使用插件的问题

## 2.4.0

### Minor Changes

- 2ce261e: 将未验证功能插件化

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
