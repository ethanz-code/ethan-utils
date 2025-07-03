# @ethan-utils/axios

高可用 axios 请求库，支持全局配置、请求拦截、响应拦截、自动重试、Token 注入、401 回调等功能，适用于前后端分离项目的 API 请求统一管理。

## 特性

- **单例/多实例模式**：支持全局单例和多实例灵活切换。
- **标准响应与原始响应**：所有请求方法分为标准响应（`BaseResponse`）和原始响应（`raw`）两类。
- **自动重试**：网络错误和 5xx 状态自动重试。
- **Token 注入**：支持动态获取 Token 并自动注入请求头。
- **401 回调**：支持未授权自动回调处理。
- **TypeScript 完全类型支持**。

## 安装

建议使用 pnpm 进行依赖管理：

```sh
pnpm add @ethan-utils/axios axios axios-retry qs
```

> 依赖：axios、axios-retry、qs

## 快速上手

### 1. 初始化全局请求客户端

在应用入口（如 `main.ts` 或 `app.ts`）调用 `createRequest` 并设置为全局单例（默认即可），否则后续调用 `request` 会抛出错误。

```typescript
import { createRequest, request } from "@ethan-utils/axios";

createRequest({
  baseURL: "https://api.example.com",
  timeout: 10000,
  getToken: () => localStorage.getItem("token"), // 可选，自动注入 Authorization
  onUnauthorized: () => {
    // 可选，401 未授权时的处理
    window.location.href = "/login";
  },
});

// 之后可直接使用 request 进行请求
```

### 2. 发起请求

```typescript
import { request } from "@ethan-utils/axios";

// 标准响应（BaseResponse）
const res = await request.get<User>("/users/1");
if (res.code === 200) {
  console.log(res.data);
} else {
  console.error(res.msg);
}

// 原始响应（遇到错误直接抛出异常）
try {
  const user = await request.raw.get<User>("/users/1");
  console.log(user);
} catch (e) {
  // 需自行处理异常
}
```

### 3. 多实例用法

如需隔离不同 API 客户端，可用 `createRequest` 创建多实例：

```typescript
import { createRequest } from "@ethan-utils/axios";

const api1 = createRequest({ baseURL: "https://api1.com" }, false); // 新实例
const api2 = createRequest({ baseURL: "https://api2.com" }, false);

const res1 = await api1.get<any>("/foo");
const res2 = await api2.get<any>("/bar");
```

## API 说明

### 初始化

- `createRequest(options: CreateApiOptions, isSingleton = true)`：创建请求客户端，`isSingleton` 为 true 时返回全局单例，否则每次返回新实例。**如需初始化全局 request，直接调用一次即可。**
- `request`：全局请求客户端代理，需先用 `createRequest` 初始化。

### 请求方法

所有方法均支持标准响应（BaseResponse）和原始响应（raw）：

- `get<T>(url, config?)`
- `post<T>(url, data?, config?)`
- `put<T>(url, data?, config?)`
- `delete<T>(url, config?)`
- `patch<T>(url, data?, config?)`

原始响应方法通过 `raw` 命名空间调用：

- `raw.get<T>(url, config?)`
- `raw.post<T>(url, data?, config?)`
- `raw.put<T>(url, data?, config?)`
- `raw.delete<T>(url, config?)`
- `raw.patch<T>(url, data?, config?)`

#### 返回值说明

- 标准响应：`Promise<BaseResponse<T>>`，失败时 code 非 200/201，data 为 null，msg 为错误信息。
- 原始响应：`Promise<T>`，失败时直接抛出异常。

### 类型定义

```typescript
/**
 * 标准化 API 响应结构
 */
export interface BaseResponse<T> {
  data: T; // 实际数据
  msg: string; // 提示信息
  code: number; // 业务状态码
}

/**
 * 创建 API 实例的配置选项
 */
export interface CreateApiOptions {
  baseURL: string; // API 的基础 URL
  getToken?: () => string | null; // 获取认证令牌的函数
  onUnauthorized?: () => void; // 401 未授权时的回调
  timeout?: number; // 请求超时时间
}
```

## 注意事项

- **必须先初始化**：未初始化直接调用 `request` 会抛出 `API client has not been initialized. Please call createRequest() first.`
- **Token 自动注入**：如需自动携带 token，传入 `getToken`。
- **401 处理**：如需自动跳转登录等，传入 `onUnauthorized`。
- **自动重试**：网络错误和 5xx 状态自动重试 3 次。
- **request.r**：`request` 还有一个简写别名 `r`，用法一致。

## 依赖

- axios
- axios-retry
- qs

## 贡献与反馈

如有问题或建议，欢迎提 issue 或 PR。

- 仓库地址：https://github.com/ethanz-code/ethan-utils
