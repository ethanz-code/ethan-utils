/**
 * @file packages/pinia/index.ts
 * @description 封装 Pinia，内置持久化插件并提供便捷的 API 导出。
 * @author Ethan Zhang
 * @date 2025-07-24
 */

// 从 pinia 中重新导出常用的 API，但不包括 createPinia
/**
 * 从 `pinia` 库重新导出常用的 API，方便在应用中统一从此模块导入。
 * 这样做可以避免在项目中到处直接依赖 `pinia`，便于未来进行统一的封装或替换。
 *
 * @see {@link https://pinia.vuejs.org/api/modules.html}
 */
export {
  defineStore,
  storeToRefs,
  mapActions,
  mapGetters,
  mapState,
  mapStores,
  mapWritableState,
  getActivePinia,
  setActivePinia,
  setMapStoreSuffix,
  skipHydrate,
  acceptHMRUpdate,
} from "pinia";

// 导入创建 pinia 实例所必需的函数
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { stringify, parse } from "zipson";

/**
 * @constant {Pinia} pinia
 * @description 创建并导出的 Pinia 实例。
 * 该实例已经预配置了 `pinia-plugin-persistedstate` 插件，
 * 用于实现 Store 状态的持久化。
 *
 * @see {@link https://prazdevs.github.io/pinia-plugin-persistedstate/}
 */
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

/**
 * @constant {object} persistOptions
 * @description 预设的持久化配置对象，用于 `defineStore` 的 `persist` 选项。
 * 使用 `localStorage` 进行存储，并通过 `zipson` 进行序列化和反序列化，以减小存储体积。
 *
 * @property {Storage} storage - 指定 `localStorage` 作为存储介质。
 * @property {object} serializer - 指定序列化工具。
 * @property {function} serializer.serialize - 使用 `zipson.stringify` 进行序列化。
 * @property {function} serializer.deserialize - 使用 `zipson.parse` 进行反序列化。
 *
 * @example
 * // 在定义 store 时使用
 * import { defineStore, persistOptions } from '@ethan-utils/pinia';
 *
 * export const useUserStore = defineStore('user', {
 *   state: () => ({ name: 'John' }),
 *   persist: persistOptions,
 * });
 */
export const persistOptions = {
  storage: localStorage,
  serializer: {
    serialize: stringify,
    deserialize: parse,
  },
};

/**
 * @description 默认导出已配置好持久化插件的 Pinia 实例。
 * 在 Vue 应用的入口文件（如 `main.ts`）中通过 `app.use(pinia)` 来注册。
 * @example
 * // main.ts
 * import { createApp } from 'vue';
 * import App from './App.vue';
 * import pinia from '@ethan-utils/pinia';
 *
 * const app = createApp(App);
 * app.use(pinia);
 * app.mount('#app');
 */
export default pinia;
