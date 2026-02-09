import { describe, expect, it } from "vitest";
import { ISOTimeProvider } from "./index.js";

describe("ISOTimeProvider", () => {
  it("should return a valid ISO string", () => {
    const provider = new ISOTimeProvider();
    const time = provider.getServerTime();

    expect(time).toBeTypeOf("string");
    expect(() => new Date(time)).not.toThrow();
    expect(new Date(time).toISOString()).toBe(time);
  });

  it("should return current time", () => {
    const provider = new ISOTimeProvider();
    const before = Date.now();
    const time = provider.getServerTime();
    const after = Date.now();

    const timestamp = new Date(time).getTime();
    expect(timestamp).toBeGreaterThanOrEqual(before);
    expect(timestamp).toBeLessThanOrEqual(after);
  });
});
