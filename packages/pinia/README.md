# Pinia 增强封装

基于 [Pinia](https://pinia.vuejs.org/) 的增强封装，集成状态持久化（localStorage，zipson 压缩），开箱即用，API 与原生 Pinia 保持一致。

## 特性

- 开箱即用：已集成并激活 `pinia-plugin-persistedstate`
- 高效压缩：持久化数据采用 `zipson` 压缩，显著减小 localStorage 占用
- API 一致：完整导出 Pinia 常用 API（如 `defineStore`、`storeToRefs` 等）
- 灵活配置：提供预设的 `persistOptions`，可快速为 Store 添加持久化

## 安装

可通过包管理器直接安装：

```bash
pnpm add @ethan-utils/pinia
# 或
npm install @ethan-utils/pinia
# 或
yarn add @ethan-utils/pinia
```

## 快速上手

### 1. 在 Vue 应用中注册

在应用入口文件（如 `src/main.ts`）导入并注册 pinia：

```typescript
import { createApp } from "vue";
import App from "./App.vue";
import pinia from "@ethan-utils/pinia";

const app = createApp(App);
app.use(pinia);
app.mount("#app");
```

### 2. 创建 Store

支持组合式 API 和选项式 API 两种写法。

#### 组合式 API 示例（推荐）

```typescript
// stores/user.ts
import { defineStore, persistOptions } from "@ethan-utils/pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    const userId = ref<number | null>(null);
    const token = ref("");
    const profile = ref<Record<string, any>>({});

    function login(id: number, t: string) {
      userId.value = id;
      token.value = t;
    }
    function logout() {
      userId.value = null;
      token.value = "";
      profile.value = {};
    }

    return { userId, token, profile, login, logout };
  },
  {
    persist: persistOptions,
  },
);
```

#### 选项式 API 示例

```typescript
// stores/ui.ts
import { defineStore } from "@ethan-utils/pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    isSidebarOpen: true,
    isLoading: false,
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
  },
  // 如需持久化可加 persist: persistOptions
});
```

---

如需更多用法，请参考 Pinia 官方文档或本包源码。
