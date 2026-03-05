import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"

function Home() {
  return <h1>Welcome</h1>
}

describe("home component", () => {
  it("renders welcome text", () => {
    render(<Home />)
    expect(screen.getByText("Welcome")).toBeTruthy()
  })
})