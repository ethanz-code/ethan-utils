import { expect, test } from "vitest";
import { createRequest, type CreateApiOptions } from "../index";

const apiOptions: CreateApiOptions = {
  baseURL: "https://localhost:5173",
};

test("单例模式：多次 createRequest 返回同一实例", () => {
  const instance1 = createRequest(apiOptions, true);
  const instance2 = createRequest(apiOptions, true);
  expect(instance1).toBe(instance2);
});

test("多实例模式：每次 createRequest 返回新实例", () => {
  const instance1 = createRequest(apiOptions, false);
  const instance2 = createRequest(apiOptions, false);
  expect(instance1).not.toBe(instance2);
});

test("单例与多实例互不影响", () => {
  const singleton1 = createRequest(apiOptions, true);
  const singleton2 = createRequest(apiOptions, true);
  const multi1 = createRequest(apiOptions, false);
  const multi2 = createRequest(apiOptions, false);

  // 单例始终相等
  expect(singleton1).toBe(singleton2);

  // 多实例始终不等
  expect(multi1).not.toBe(multi2);

  // 多实例与单例也不等
  expect(multi1).not.toBe(singleton1);
  expect(multi2).not.toBe(singleton1);
});
