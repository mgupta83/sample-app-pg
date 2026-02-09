import type { HttpRequest, InvocationContext } from "@azure/functions";
import { describe, expect, it, vi } from "vitest";
import { timeHandler } from "./index.js";

describe("timeHandler", () => {
  it("should return JSON with serverTime and message", async () => {
    const mockRequest = {} as HttpRequest;
    const mockContext = {
      log: vi.fn(),
      res: undefined,
    } as unknown as InvocationContext;

    const response = await timeHandler(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(response.headers).toHaveProperty("Content-Type", "application/json");
    expect(response.body).toBeDefined();

    const body = JSON.parse(response.body as string);
    expect(body).toHaveProperty("serverTime");
    expect(body).toHaveProperty("message", "ok");
    expect(typeof body.serverTime).toBe("string");

    // Verify serverTime is a valid ISO string
    expect(() => new Date(body.serverTime)).not.toThrow();
  });

  it("should set context.res", async () => {
    const mockRequest = {} as HttpRequest;
    const mockContext = {
      log: vi.fn(),
      res: undefined,
    } as unknown as InvocationContext;

    await timeHandler(mockRequest, mockContext);

    expect(mockContext.res).toBeDefined();
    expect(mockContext.res?.status).toBe(200);
  });

  it("should log request processing", async () => {
    const mockRequest = {} as HttpRequest;
    const mockContext = {
      log: vi.fn(),
      res: undefined,
    } as unknown as InvocationContext;

    await timeHandler(mockRequest, mockContext);

    expect(mockContext.log).toHaveBeenCalledWith("HTTP trigger function processed a request.");
  });
});
