# Axios 封装

该包对 `axios` 进行了封装，提供了统一的 API 请求客户端。

## 特性

- 单例模式：通过 `initApiClient` 初始化，全局共享一个 `axios` 实例。
- 统一响应格式：默认请求方法返回 `BaseResponse<T>` 格式的数据。
- 统一错误处理：自动捕获请求错误并返回标准化的错误响应。
- TypeScript 支持：提供完整的类型定义。
- 提供不包装响应体的方法：为特殊场景，提供了 `...WithoutBaseResponse` 系列方法。

## 安装

由于是在 monorepo 环境中，您可以直接在其他包的 `package.json` 中添加依赖：

```json
"dependencies": {
  "@ethan-utils/axios": "workspace:*"
}
```

然后运行 `pnpm install`。

## 使用方法

### 1. 初始化

在应用入口处（例如 `main.ts` 或 `app.ts`），调用 `initApiClient` 来初始化请求客户端。

```typescript
// src/main.ts
import { initApiClient } from "@ethan-utils/axios";

initApiClient({
  baseURL: "https://api.example.com",
  timeout: 10000,
  // 其他 axios 配置
});
```

### 2. 发起请求

在需要发起 API 请求的地方，导入 `request` 对象。

```typescript
import { request } from "@ethan-utils/axios";

interface User {
  id: number;
  name: string;
}

// GET 请求
async function getUser(id: number) {
  const res = await request.get<User>(`/users/${id}`);
  if (res.code === 200) {
    console.log(res.data); // { id: 1, name: 'John Doe' }
  } else {
    console.error(res.msg);
  }
}

// POST 请求
async function createUser(name: string) {
  const res = await request.post<{ success: boolean }>("/users", { name });
  if (res.code === 201) {
    console.log("User created");
  } else {
    console.error(res.msg);
  }
}
```

### 3. 使用不带 BaseResponse 的方法

如果您的 API 端点没有遵循 `BaseResponse` 结构，可以使用 `WithoutBaseResponse` 系列方法。这些方法在成功时直接返回后端返回的 `data`，在失败时会直接抛出错误，需要您自行使用 `try...catch` 处理。

```typescript
import { request } from "@ethan-utils/axios";

// 假设 /profile 直接返回用户对象
interface Profile {
  username: string;
  email: string;
}

async function getProfile() {
  try {
    const profile = await request.getWithoutBaseResponse<Profile>("/profile");
    console.log(profile.username);
  } catch (error) {
    // 自行处理错误
    console.error("Failed to fetch profile:", error);
  }
}
```

## API

`request` 对象包含以下方法:

- `get<T>(url, config)`
- `getWithoutBaseResponse<T>(url, config)`
- `post<T>(url, data, config)`
- `postWithoutBaseResponse<T>(url, data, config)`
- `put<T>(url, data, config)`
- `putWithoutBaseResponse<T>(url, data, config)`
- `delete<T>(url, config)`
- `deleteWithoutBaseResponse<T>(url, config)`
- `patch<T>(url, data, config)`
- `patchWithoutBaseResponse<T>(url, data, config)`

所有被 `BaseResponse` 包装的方法，当请求失败时，会返回一个 `BaseResponse` 对象，其中 `code` 通常不为 200 或 201 等成功状态码，`data` 为 `null`，`msg` 包含错误信息。
