# @ethan-utils/zustand

> 封装 Zustand create 函数，一个带有 immer、可选持久化（persist）和选择性订阅（subscribeWithSelector）功能的 zustand store 工具。

## 特性

- **内置 immer**：支持对嵌套状态的不可变更新，书写更简洁。
- **可选持久化**：一行集成 zustand 的 persist 插件，支持 localStorage、sessionStorage、IndexedDB 等。
- **选择性订阅（subscribeWithSelector）**：自动集成 subscribeWithSelector，支持对任意状态片段的精准订阅，只有选中的状态发生变化时才会触发组件更新，极大提升性能和响应性。
- **清理缓存**：自动为 store 增加 clearStorage 方法，方便清空持久化缓存。
- **极简 API**：一行代码创建强大 store。

## 安装

```bash
pnpm add @ethan-utils/zustand
```

## 快速上手

### 1. 创建 store

```ts
import { create } from "@ethan-utils/zustand";

// 基础用法
const useCounterStore = create((set, get) => ({
  count: 0,
  inc: () =>
    set((state) => {
      state.count += 1;
    }),
  dec: () =>
    set((state) => {
      state.count -= 1;
    }),
}));

// 持久化用法
const usePersistStore = create(
  (set, get) => ({
    value: 0,
    setValue: (v: number) =>
      set((state) => {
        state.value = v;
      }),
  }),
  { name: "my-persist-key", storage: localStorage },
);
```

### 2. 组件中使用

```tsx
import React from "react";
import { useShallow } from "@ethan-utils/zustand";

function Counter() {
  const { count, inc, dec } = useCounterStore(
    useShallow((state) => ({
      count: state.count,
      inc: state.inc,
      dec: state.dec,
    })),
  );
  return (
    <div>
      <button onClick={dec}>-</button>
      <span>{count}</span>
      <button onClick={inc}>+</button>
    </div>
  );
}
```

### 3. 订阅（subscribe）用法

你可以直接使用 zustand 的 subscribe 能力，并且由于本包自动集成了 subscribeWithSelector，可以精准订阅任意状态片段：

```ts
// 订阅某个状态字段变化
const unsub = useCounterStore.subscribe(
  (state) => state.count,
  (count, prevCount) => {
    console.log("count 变化了:", count, prevCount);
  },
);

// 订阅多个字段（推荐配合 useShallow 或自定义 selector）
const unsubMulti = useCounterStore.subscribe(
  (state) => ({ count: state.count, value: state.value }),
  (curr, prev) => {
    console.log("count 或 value 变化了:", curr, prev);
  },
  {
    equalityFn: (a, b) => a.count === b.count && a.value === b.value,
    fireImmediately: false,
  },
);

// 记得在不需要时取消订阅
unsub();
```

> subscribeWithSelector 的优势：
>
> - 只在 selector 选中的状态发生变化时才触发回调，避免无效更新。
> - 支持自定义 equalityFn，灵活控制对比逻辑。
> - 支持 fireImmediately，订阅时可立即触发 listener，便于初始化逻辑。
> - 适合性能敏感场景或需要响应特定状态变化的业务。

## API 说明

### create(fn, persist?)

- `fn: (set, get) => T`  
  定义 store 结构和逻辑的函数。
- `persist?: { name: string; storage: Storage }`  
  可选，持久化配置对象。

返回：`useStore` hook。

### useShallow

- 用于浅层比较，只有第一层状态变化时才会触发组件更新。
- 用法同 `zustand/react/shallow`。

### subscribe(selector, listener, options?)

- `selector: (state) => any`  
  选择需要监听的状态片段。
- `listener: (curr, prev) => void`  
  状态变化时的回调。
- `options.equalityFn?: (a, b) => boolean`  
  可选，自定义对比函数，只有 selector 结果发生实际变化时才会触发 listener。
- `options.fireImmediately?: boolean`  
  可选，是否在订阅时立即触发 listener，常用于初始化。

返回：取消订阅的函数。

> 本包已自动集成 subscribeWithSelector，所有 subscribe 均为精准订阅，无需手动引入。

## 常见问题

### 1. 如何自定义持久化存储？

传入 `persist` 参数的 `storage` 字段即可，支持 `localStorage`、`sessionStorage`、自定义 Storage。

### 2. 支持 TypeScript 吗？

完全支持，类型推导友好。

### 3. 需要手动引入 immer/persist/subscribeWithSelector 吗？

无需手动引入，已自动集成。

## 依赖说明

- [zustand](https://github.com/pmndrs/zustand)

## License

MIT
