import { create as _create } from "zustand";
import { immer as _immer } from "zustand/middleware/immer";
import {
  createJSONStorage,
  persist as _persist,
  subscribeWithSelector as _subscribeWithSelector,
} from "zustand/middleware";
import { useShallow as _useShallow } from "zustand/react/shallow";

/**
 * 导出这个用于让状态只在第一层浅层发生变化时才会触发组件更新。
 *  */
export const useShallow = _useShallow;

/**
 * 创建一个带有 immer、可选持久化（persist）和选择性订阅（subscribeWithSelector）功能的 zustand store。
 *
 * 1. 默认集成 immer 中间件，支持对嵌套状态的不可变更新。
 * 2. 如果传入 persist 参数，则自动集成 zustand 的 persist 中间件，实现状态持久化，并可自定义存储方式（如 localStorage、sessionStorage、IndexedDB 等）。
 * 3. 自动集成 subscribeWithSelector 插件，支持选择性订阅，只有选中的状态发生变化时才会触发组件更新，提升性能。
 * 4. 自动为 store 增加 clearStorage 方法，用于清空持久化缓存。
 *
 * @template T store 的类型
 * @param fn (set, get) => T，定义 store 结构和逻辑的函数，参数 set/get 分别用于更新和获取状态。
 * @param persist 可选，持久化配置对象：
 *   - name: string，持久化存储的 key 名称（建议唯一）。
 *   - storage: Storage，持久化存储方式，默认 localStorage。
 * @returns 返回创建好的 zustand store 实例。
 */
export const create = <T>(
  fn: (set: any, get: any) => T,
  persist?: { name: string; storage: Storage },
) => {
  return _create<T>()(
    _subscribeWithSelector(
      _immer(
        persist
          ? _persist(fn, {
              name: persist.name,
              storage: createJSONStorage(() => persist.storage),
            })
          : fn,
      ),
    ),
  );
};
