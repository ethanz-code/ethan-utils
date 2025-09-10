# @ethan-utils/axios

高可用 axios 请求库，支持全局配置、插件扩展、请求拦截、响应拦截、自动重试、Token 注入、401 回调等功能，适用于前后端分离项目的 API 请求统一管理。

## 包介绍

### 功能和使用场景

- **企业级 HTTP 客户端**：基于 axios 封装的高可用请求库
- **前后端分离项目**：统一管理 API 请求，支持标准响应格式和直接响应
- **微服务架构**：支持多实例模式，可同时管理多个 API 服务
- **身份验证管理**：自动 Token 注入和失效处理
- **请求安全控制**：防重复提交、请求体大小限制等安全机制

### 特性

- **单例/多实例模式**：支持全局单例和多实例灵活切换
- **双重响应模式**：标准响应（`BaseResponse`）和直接响应两种模式
- **插件系统**：支持通过插件扩展功能，内置多种实用插件
- **自动重试**：网络错误和 5xx 状态自动重试
- **Token 注入**：支持动态获取 Token 并自动注入请求头
- **TypeScript 完全类型支持**：提供完整的类型定义

### 安装方式

```bash
# npm
npm install @ethan-utils/axios

# yarn
yarn add @ethan-utils/axios

# pnpm（推荐）
pnpm add @ethan-utils/axios
```

> 依赖：axios、axios-retry、qs

### 简单使用示例

```typescript
import { createRequest, request } from "@ethan-utils/axios";

// 1. 初始化全局请求客户端
createRequest({
  baseURL: "https://api.example.com",
  timeout: 10000,
  getToken: () => {
    const token = localStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  },
});

// 2. 发起请求
// 直接响应（推荐）
const user = await request.get<User>("/users/1");
console.log(user);

// 标准响应（带 BaseResponse 封装）
const res = await request.std.get<User>("/users/1");
if (res.code === 200) {
  console.log(res.data);
} else {
  console.error(res.message);
}
```

## API 文档

### 核心方法

#### createRequest

创建请求客户端实例。

| 参数        | 类型             | 必填 | 默认值 | 说明           |
| ----------- | ---------------- | ---- | ------ | -------------- |
| options     | CreateApiOptions | 是   | -      | 配置选项       |
| isSingleton | boolean          | 否   | true   | 是否为单例模式 |

**返回值**：`ApiClient` - 请求客户端实例

```typescript
// 全局单例（推荐）
const api = createRequest({
  baseURL: "https://api.example.com",
  timeout: 10000,
  getToken: () => localStorage.getItem("token"),
});

// 多实例模式
const api1 = createRequest({ baseURL: "https://api1.com" }, false);
const api2 = createRequest({ baseURL: "https://api2.com" }, false);
```

#### request

全局请求客户端代理，需先调用 `createRequest` 初始化。

**直接响应方法**：

| 方法      | 参数                  | 返回值     | 说明                      |
| --------- | --------------------- | ---------- | ------------------------- |
| get<T>    | (url, config?)        | Promise<T> | GET 请求，直接返回数据    |
| post<T>   | (url, data?, config?) | Promise<T> | POST 请求，直接返回数据   |
| put<T>    | (url, data?, config?) | Promise<T> | PUT 请求，直接返回数据    |
| delete<T> | (url, config?)        | Promise<T> | DELETE 请求，直接返回数据 |
| patch<T>  | (url, data?, config?) | Promise<T> | PATCH 请求，直接返回数据  |

**标准响应方法（std 命名空间）**：

| 方法          | 参数                  | 返回值                   | 说明                      |
| ------------- | --------------------- | ------------------------ | ------------------------- |
| std.get<T>    | (url, config?)        | Promise<BaseResponse<T>> | GET 请求，返回标准格式    |
| std.post<T>   | (url, data?, config?) | Promise<BaseResponse<T>> | POST 请求，返回标准格式   |
| std.put<T>    | (url, data?, config?) | Promise<BaseResponse<T>> | PUT 请求，返回标准格式    |
| std.delete<T> | (url, config?)        | Promise<BaseResponse<T>> | DELETE 请求，返回标准格式 |
| std.patch<T>  | (url, data?, config?) | Promise<BaseResponse<T>> | PATCH 请求，返回标准格式  |

**插件方法**：

| 方法   | 参数               | 说明     |
| ------ | ------------------ | -------- |
| use<T> | (plugin, options?) | 注册插件 |

### 类型定义

#### CreateApiOptions

| 属性     | 类型                 | 必填 | 默认值 | 说明                 |
| -------- | -------------------- | ---- | ------ | -------------------- |
| baseURL  | string               | 是   | -      | API 的基础 URL       |
| getToken | () => string \| null | 否   | -      | 获取认证令牌的函数   |
| timeout  | number               | 否   | -      | 请求超时时间（毫秒） |

#### BaseResponse<T>

标准化 API 响应结构：

| 属性    | 类型   | 说明       |
| ------- | ------ | ---------- |
| data    | T      | 实际数据   |
| message | string | 提示信息   |
| code    | number | 业务状态码 |

### 错误处理机制

#### 直接响应模式

- 请求失败时直接抛出异常
- 需要使用 try-catch 捕获错误
- 适用于自定义错误处理逻辑

```typescript
try {
  const user = await request.get<User>("/users/1");
  console.log(user);
} catch (error) {
  console.error("请求失败:", error.message);
}
```

#### 标准响应模式

- 错误会被转换为标准响应格式
- 通过 code 字段判断请求是否成功
- 错误信息包含在 message 字段中

```typescript
const res = await request.std.get<User>("/users/1");
if (res.code === 200) {
  console.log("成功:", res.data);
} else {
  console.error("失败:", res.message);
}
```

### 示例代码

#### 基础用法

```typescript
import { createRequest, request } from "@ethan-utils/axios";

// 初始化
createRequest({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 5000,
});

// 获取用户列表
const users = await request.get<User[]>("/users");

// 创建用户
const newUser = await request.post<User>("/users", {
  name: "John Doe",
  email: "john@example.com",
});

// 更新用户
const updatedUser = await request.put<User>("/users/1", {
  name: "Jane Doe",
});

// 删除用户
await request.delete("/users/1");
```

#### 带认证的请求

```typescript
createRequest({
  baseURL: "https://api.example.com",
  getToken: () => {
    const token = localStorage.getItem("authToken");
    return token ? `Bearer ${token}` : null;
  },
});

// 所有请求都会自动携带 Authorization 头
const profile = await request.get<UserProfile>("/profile");
```

## 高级用法

### 多实例管理

适用于需要同时访问多个不同 API 服务的场景：

```typescript
import { createRequest } from "@ethan-utils/axios";

// 用户服务 API
const userApi = createRequest(
  {
    baseURL: "https://user-api.example.com",
    getToken: () => getUserToken(),
  },
  false,
);

// 订单服务 API
const orderApi = createRequest(
  {
    baseURL: "https://order-api.example.com",
    getToken: () => getOrderToken(),
  },
  false,
);

// 分别调用不同服务
const user = await userApi.get<User>("/profile");
const orders = await orderApi.get<Order[]>("/orders");
```

### 插件系统

#### 1. 防重复提交插件

```typescript
import { createRequest, preventRepeat } from "@ethan-utils/axios";

const api = createRequest({ baseURL: "..." }, false);
api.use(preventRepeat, {
  onRepeat: (msg, config) => {
    console.warn("重复提交:", msg);
    // 可以显示 toast 提示
  },
});

// 短时间内重复调用会被阻止
api.post("/submit-form", formData);
api.post("/submit-form", formData); // 会被阻止
```

#### 2. 请求体大小限制插件

```typescript
import { createRequest, limitBodySize } from "@ethan-utils/axios";

const api = createRequest({ baseURL: "..." }, false);
api.use(limitBodySize, {
  maxBodySize: 2 * 1024 * 1024, // 2MB
  onLimit: (msg, config) => {
    alert("文件过大: " + msg);
  },
});

// 超过限制的请求会被拦截
api.post("/upload", largeFile);
```

#### 3. 未授权处理插件

```typescript
import { createRequest, unauthorized } from "@ethan-utils/axios";

const api = createRequest({ baseURL: "..." }, false);
api.use(unauthorized, {
  onUnauthorized: () => {
    // 清除本地 token
    localStorage.removeItem("token");
    // 跳转到登录页
    window.location.href = "/login";
  },
  unauthorizedCodes: [401, 1001, 1002], // 支持多个状态码
});
```

### 与其他库的结合示例

#### 与 Vue 3 结合

```typescript
// api.ts
import { createRequest } from "@ethan-utils/axios";
import { useUserStore } from "@/stores/user";

export const api = createRequest({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  getToken: () => {
    const userStore = useUserStore();
    return userStore.token ? `Bearer ${userStore.token}` : null;
  },
});

// 在组件中使用
// UserList.vue
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { api } from "@/utils/api";

const users = ref<User[]>([]);

onMounted(async () => {
  try {
    users.value = await api.get<User[]>("/users");
  } catch (error) {
    console.error("获取用户列表失败:", error);
  }
});
</script>
```

#### 与 React 结合

```typescript
// hooks/useApi.ts
import { useState, useEffect } from "react";
import { request } from "@ethan-utils/axios";

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await request.get<T>(url);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 在组件中使用
function UserList() {
  const { data: users, loading, error } = useApi<User[]>("/users");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 常见使用场景

#### 文件上传

```typescript
// 上传单个文件
async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return await request.post<{ url: string }>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// 上传多个文件
async function uploadFiles(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return await request.post<{ urls: string[] }>("/upload-multiple", formData);
}
```

#### 分页查询

```typescript
interface PaginationParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

async function getUsers(params: PaginationParams) {
  return await request.get<PaginationResponse<User>>("/users", {
    params,
  });
}

// 使用
const result = await getUsers({ page: 1, pageSize: 10, keyword: "john" });
console.log(result.list); // 用户列表
console.log(result.total); // 总数
```

#### 批量操作

```typescript
// 批量删除
async function batchDelete(ids: number[]) {
  return await request.delete("/users/batch", {
    data: { ids },
  });
}

// 批量更新
async function batchUpdate(
  updates: Array<{ id: number; data: Partial<User> }>,
) {
  return await request.put("/users/batch", { updates });
}
```

## 版本记录

### v2.0.0

**重大变更**

- 🔄 将 `direct` 命名空间改为 `std`（标准响应）
- 🔄 直接响应方法移至根级别（`request.get` 等）
- 📝 更新 API 文档和使用示例

**改进**

- ✨ 更直观的 API 设计
- 📚 完善的文档结构
- 🎯 更清晰的使用场景说明

### v1.2.0

**新增**

- ✨ 添加防重复提交插件
- ✨ 添加请求体大小限制插件
- ✨ 添加未授权处理插件
- 📝 完善插件系统文档

**改进**

- 🐛 修复多实例模式下的内存泄漏问题
- ⚡ 优化错误处理机制
- 📚 增加更多使用示例

### v1.1.0

**新增**

- ✨ 支持多实例模式
- ✨ 添加插件系统
- ✨ 支持自动重试机制

**改进**

- 🐛 修复 TypeScript 类型定义问题
- ⚡ 优化请求性能
- 📝 完善 API 文档

### v1.0.0

**首次发布**

- ✨ 基础 HTTP 请求功能
- ✨ 支持标准响应和直接响应两种模式
- ✨ 自动 Token 注入
- ✨ 完整的 TypeScript 支持
- 📝 基础文档和示例

## 贡献指南

### 本地开发

1. 克隆仓库

```bash
git clone https://github.com/ethanz-code/ethan-utils.git
cd ethan-utils/packages/axios
```

2. 安装依赖

```bash
pnpm install
```

3. 开发模式

```bash
pnpm dev
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行测试并监听文件变化
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage
```

### 构建项目

```bash
# 构建生产版本
pnpm build

# 类型检查
pnpm type-check

# 代码格式化
pnpm format

# 代码检查
pnpm lint
```

### 发版流程

1. 更新版本号

```bash
pnpm version patch  # 补丁版本
pnpm version minor  # 次要版本
pnpm version major  # 主要版本
```

2. 构建和测试

```bash
pnpm build
pnpm test
```

3. 发布到 npm

```bash
pnpm publish
```

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建工具或辅助工具的变动

示例：

```bash
git commit -m "feat: 添加防重复提交插件"
git commit -m "fix: 修复多实例模式下的内存泄漏"
git commit -m "docs: 更新 API 文档"
```

## 许可证

MIT License

## 相关链接

- [GitHub 仓库](https://github.com/ethanz-code/ethan-utils)
- [问题反馈](https://github.com/ethanz-code/ethan-utils/issues)
- [更新日志](./CHANGELOG.md)
- [贡献指南](../../CONTRIBUTING.md)
