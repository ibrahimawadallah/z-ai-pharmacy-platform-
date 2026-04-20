import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { SecondaryPanelProvider, useSecondaryPanel } from "@/components/intelligence/secondary-panel"

vi.mock("@/components/ui/drawer", async () => {
  const React = await import("react")
  return {
    Drawer: ({ open, children }: { open?: boolean; children: React.ReactNode }) =>
      open ? <div data-testid="drawer-root">{children}</div> : null,
    DrawerContent: ({ children }: { children: React.ReactNode }) => (
      <div role="dialog">{children}</div>
    ),
    DrawerHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DrawerTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    DrawerDescription: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  }
})

let controller: ReturnType<typeof useSecondaryPanel> | null = null

function TestHarness() {
  const api = useSecondaryPanel()
  const { openPanel } = api

  React.useEffect(() => {
    controller = api
  }, [api])

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          openPanel({
            id: "panel-a",
            title: "Panel A",
            description: "First panel",
            content: <div>Content A</div>,
          })
        }
      >
        Open A
      </button>
      <button
        type="button"
        onClick={() =>
          openPanel({
            id: "panel-b",
            title: "Panel B",
            description: "Second panel",
            content: <div>Content B</div>,
          })
        }
      >
        Open B
      </button>
    </div>
  )
}

describe("SecondaryPanelProvider", () => {
  it("shows no more than one secondary panel at any time", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(
      <SecondaryPanelProvider>
        <TestHarness />
      </SecondaryPanelProvider>
    )
    await waitFor(() => expect(controller).not.toBeNull())

    await user.click(screen.getByRole("button", { name: "Open A" }))
    expect(screen.getByText("Panel A")).toBeInTheDocument()
    expect(screen.getByText("Content A")).toBeInTheDocument()
    expect(screen.queryByText("Panel B")).not.toBeInTheDocument()

    controller!.openPanel({
      id: "panel-b",
      title: "Panel B",
      description: "Second panel",
      content: <div>Content B</div>,
    })
    await waitFor(() => expect(screen.getByText("Panel B")).toBeInTheDocument())
    expect(screen.getByText("Content B")).toBeInTheDocument()
    expect(screen.queryByText("Panel A")).not.toBeInTheDocument()
  })

  it("returns focus to the invoking control when the panel closes", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    render(
      <SecondaryPanelProvider>
        <TestHarness />
      </SecondaryPanelProvider>
    )
    await waitFor(() => expect(controller).not.toBeNull())

    const openA = screen.getByRole("button", { name: "Open A" })
    openA.focus()
    expect(openA).toHaveFocus()

    await user.click(openA)
    const close = await screen.findByRole("button", { name: "Close panel" })
    expect(close).toHaveFocus()

    await user.click(close)
    await Promise.resolve()
    expect(openA).toHaveFocus()

    const openB = screen.getByRole("button", { name: "Open B" })
    openB.focus()
    await user.click(openB)
    const closeB = await screen.findByRole("button", { name: "Close panel" })
    await user.click(closeB)
    await Promise.resolve()
    expect(openB).toHaveFocus()
  })
})
