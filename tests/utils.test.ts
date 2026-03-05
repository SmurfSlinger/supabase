import { describe, it, expect } from "vitest"

function formatName(name: string | null) {
  return name ?? "Anonymous"
}

describe("utility example", () => {
  it("formats null name", () => {
    expect(formatName(null)).toBe("Anonymous")
  })
})