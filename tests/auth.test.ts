import { describe, it, expect } from "vitest"

function isAuthenticated(user: any) {
  return !!user
}

describe("auth example", () => {
  it("detects authenticated user", () => {
    expect(isAuthenticated({ id: "123" })).toBe(true)
    expect(isAuthenticated(null)).toBe(false)
  })
})