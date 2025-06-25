# Pinia 增强版封装

## 简介

本项目是 [Pinia](https://pinia.vuejs.org/) 的一个增强版封装。它旨在简化 Pinia 在项目中的集成和使用，内置了基于 `localStorage` 的状态持久化功能，并使用 `zipson` 进行了数据压缩，以优化存储效率。

通过这个封装，开发者可以像使用原生 Pinia 一样使用所有核心功能，同时还能方便地为任何 Store 开启或关闭持久化，无需进行复杂的额外配置。

## 特性

- **开箱即用**: 无需手动配置，已集成并激活 `pinia-plugin-persistedstate`。
- **高效压缩**: 使用 `zipson` 作为默认序列化工具，相比标准 `JSON.stringify`，可以显著减小持久化数据在 `localStorage` 中的体积。
- **API 一致**: 重新导出了 Pinia 的所有常用 API (`defineStore`, `storeToRefs` 等)，开发者可以无缝切换，学习成本低。
- **配置灵活**: 导出了一个预设的 `persistOptions` 配置对象，方便开发者快速为 Store 添加持久化功能。

## 安装

由于这是一个本地包，您可以在项目中的其他模块直接引用它。假设您的项目结构如下：

```
/monorepo-vue-starter
├── /packages
│   ├── /pinia  <-- 这是我们的封装包
│   └── ...
└── /src        <-- 这是您的主应用
    ├── main.ts
    └── ...
```

您可以直接在 `main.ts` 或其他文件中通过相对路径引用。

## 快速上手

### 1. 在 Vue 应用中注册

首先，在您的应用入口文件（通常是 `src/main.ts`）中，导入并使用我们封装好的 `pinia` 实例。

```typescript
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";
// 从您的封装包中导入 pinia 实例
import pinia from "../packages/pinia"; // 请根据您的项目结构调整路径

const app = createApp(App);

// 注册 Pinia
app.use(pinia);

app.mount("#app");
```

### 2. 创建 Store

您可以像往常一样创建 Store，唯一的区别是从您的封装包中导入 `defineStore`。

#### 示例 1: 创建一个带持久化功能的 Store

如果您希望某个 Store 的状态能够被持久化存储，只需在定义时添加 `persist: persistOptions` 即可。

```typescript
// src/stores/user.ts
import { defineStore } from "../../packages/pinia"; // 从封装包导入
import { persistOptions } from "../../packages/pinia"; // 导入预设的持久化配置

export const useUserStore = defineStore("user", {
  state: () => ({
    userId: null,
    token: "",
    profile: {},
  }),
  actions: {
    login(userId, token) {
      this.userId = userId;
      this.token = token;
    },
    logout() {
      this.$reset();
    },
  },
  // 开启持久化
  persist: persistOptions,
});
```

当您使用这个 `userStore` 时，它的所有状态都会被 `zipson` 压缩后存储在 `localStorage` 中，并在页面刷新后自动恢复。

#### 示例 2: 创建一个普通的 Store

如果您不需要持久化某个 Store 的状态，只需省略 `persist` 选项即可。用法与原生 Pinia 完全相同。

```typescript
// src/stores/ui.ts
import { defineStore } from "../../packages/pinia"; // 从封装包导入

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
  // 该 Store 不会进行持久化
});
```

通过以上步骤，您就可以在项目中轻松地使用这个增强版的 Pinia 封装了。
