import { describe, it, expect } from "vitest";

function add(a: number, b: number) {
  return a + b;
}

describe("example test", () => {
  it("adds numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
  });
});