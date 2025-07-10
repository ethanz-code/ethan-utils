import { expect, test } from "vitest";
import { request } from "../index";

// 未初始化时，调用 request.get 应抛出指定错误

test("未初始化时调用 request.get 抛出错误", async () => {
  await expect(() => request.get("/test")).toThrowError(
    "API client has not been initialized. Please call createRequest() first.",
  );
});
