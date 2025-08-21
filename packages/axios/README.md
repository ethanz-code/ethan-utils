# @ethan-utils/axios

高可用 axios 请求库，支持全局配置、插件扩展、请求拦截、响应拦截、自动重试、Token 注入、401 回调等功能，适用于前后端分离项目的 API 请求统一管理。

## 特性

- **单例/多实例模式**：支持全局单例和多实例灵活切换。
- **标准响应与原始响应**：所有请求方法分为标准响应（`BaseResponse`）和原始响应（`raw`）两类。
- **自动重试**：网络错误和 5xx 状态自动重试。
- **Token 注入**：支持动态获取 Token 并自动注入请求头（每次请求时动态获取）。
- **未授权回调**：支持自定义未授权代码触发回调处理。
- **TypeScript 完全类型支持**。

## 安装

建议使用 pnpm 进行依赖管理：

```sh
pnpm add @ethan-utils/axios
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
  getToken: () => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null; // 返回完整的 Authorization 头值
  },
  onUnauthorized: () => {
    // 可选，未授权时的处理
    window.location.href = "/login";
  },
  unauthorizedCodes: 401, // 可选，自定义未授权代码，默认为 401
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
  console.error(res.message);
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

### 4. 自定义未授权代码

默认情况下，当响应数据中的 `code` 为 `401` 时会触发 `onUnauthorized` 回调。你可以通过 `unauthorizedCodes` 选项自定义触发条件：

```typescript
import { createRequest } from "@ethan-utils/axios";

// 单个未授权代码
createRequest({
  baseURL: "https://api.example.com",
  unauthorizedCodes: 1001, // 当响应数据的 code 为 1001 时触发
  onUnauthorized: () => {
    console.log("用户未登录");
    window.location.href = "/login";
  },
});

// 多个未授权代码
createRequest({
  baseURL: "https://api.example.com",
  unauthorizedCodes: [1001, 1002, 1003], // 支持多个代码
  onUnauthorized: () => {
    console.log("用户认证失效");
    localStorage.removeItem("token");
    window.location.href = "/login";
  },
});
```

> **注意**：这里的 `code` 指的是响应数据中的业务状态码，不是 HTTP 状态码。例如：
>
> ```json
> {
>   "code": 1001,
>   "message": "用户未登录",
>   "data": null
> }
> ```

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

- 标准响应：`Promise<BaseResponse<T>>`，失败时 code 非 200/201，data 为 null，message 为错误信息。
- 原始响应：`Promise<T>`，失败时直接抛出异常。

### 类型定义

```typescript
/**
 * 标准化 API 响应结构
 */
export interface BaseResponse<T> {
  data: T; // 实际数据
  message: string; // 提示信息
  code: number; // 业务状态码
}

/**
 * 创建 API 实例的配置选项
 */
export interface CreateApiOptions {
  baseURL: string; // API 的基础 URL
  getToken?: () => string | null; // 获取认证令牌的函数（返回完整的 Authorization 头值，如 "Bearer xxx" 或 "Token xxx"）
  onUnauthorized?: () => void; // 未授权时的回调
  unauthorizedCodes?: number | number[]; // 触发未授权回调的响应数据中的 code 值，默认为 401
  timeout?: number; // 请求超时时间
}
```

## 插件扩展

本库支持通过插件机制扩展 axios 实例能力，所有插件均可通过 `api.use(plugin, options)` 注册。

### 1. 限制请求体大小插件（limitBodySize）

用于限制 post/put/patch 请求体的最大字节数，防止大文件或超大数据误提交。

```typescript
import { createRequest } from "@ethan-utils/axios";
import { limitBodySize } from "@ethan-utils/axios/plugins/limitBodySize";

const api = createRequest({ baseURL: "..." }, false);
api.use(limitBodySize.limitBodySizePlugin, {
  maxBodySize: 2 * 1024 * 1024, // 最大 2MB
  onLimit: (msg, config) => {
    alert(msg);
  },
});
```

### 2. 防重复提交插件（preventRepeat）

用于防止表单等接口在短时间内重复提交。

```typescript
import { createRequest } from "@ethan-utils/axios";
import { preventRepeat } from "@ethan-utils/axios/plugins/preventRepeat";

const api = createRequest({ baseURL: "..." }, false);
api.use(preventRepeat.preventRepeatPlugin, {
  interval: 1500, // 1.5 秒内重复提交会被拦截
  onRepeat: (msg, config) => {
    alert(msg);
  },
});
```

## 依赖

- axios
- axios-retry
- qs

## 贡献与反馈

如有问题或建议，欢迎提 issue 或 PR。

- 仓库地址：https://github.com/ethanz-code/ethan-utils
