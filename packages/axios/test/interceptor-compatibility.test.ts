import { expect, test, vi, describe, beforeEach } from "vitest";
import { createRequest } from "../index";
import axios from "axios";

// Mock axios
vi.mock("axios", async () => {
  const actual = await vi.importActual<typeof import("axios")>("axios");
  const mockCreate = vi.fn(() => ({
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  }));

  const defaultAxios = actual.default;

  return {
    ...actual,
    default: {
      ...defaultAxios,
      create: mockCreate,
    },
  };
});

describe("请求返回值测试", () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    mockAxiosInstance = {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      patch: vi.fn(),
    };
    (axios.create as any).mockReturnValue(mockAxiosInstance);
  });

  test("请求应该正确返回数据", async () => {
    const data = { id: 1, name: "test" };
    // 模拟 get 返回结构 (完整的 AxiosResponse)
    mockAxiosInstance.get.mockResolvedValue({
      data,
      status: 200,
      headers: {},
      config: {},
    });

    const client = createRequest(
      {
        baseURL: "http://localhost",
      },
      false,
    );

    // 测试普通 get 请求
    const result = await client.get("/test");
    expect(result).toEqual(data);
  });

  test("标准请求应该正确返回数据", async () => {
    const stdData = { code: 200, message: "ok", data: { id: 1 } };
    mockAxiosInstance.get.mockResolvedValue({
      data: stdData,
      status: 200,
      headers: {},
      config: {},
    });

    const client = createRequest(
      {
        baseURL: "http://localhost",
      },
      false,
    );

    const stdResult = await client.std.get("/std-test");
    expect(stdResult).toEqual(stdData);
  });

  test("如果拦截器修改了返回值结构，应该能智能解包", async () => {
    const data = { id: 1, name: "test" };
    // 模拟用户添加了拦截器，直接返回了 data 而不是 response 对象
    mockAxiosInstance.get.mockResolvedValue(data);

    const client = createRequest(
      {
        baseURL: "http://localhost",
      },
      false,
    );

    // 这时候再调用 client.get
    // 内部实现是: const response = await api.get(); return unwrapResponse(response);
    // 此时 response = data
    // unwrapResponse(data) 应该返回 data (因为 data 不是 AxiosResponse)

    const result = await client.get("/test");
    expect(result).toEqual(data);
  });
});
