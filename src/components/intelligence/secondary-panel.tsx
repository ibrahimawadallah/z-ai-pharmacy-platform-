"use client"

import * as React from "react"
import { ExternalLink, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

export type SecondaryPanelAction =
  | {
      id: string
      label: string
      kind: "open" | "read"
      href: string
      target?: "_blank" | "_self"
      rel?: string
    }
  | {
      id: string
      label: string
      kind: "custom"
      onSelect: () => void | Promise<void>
    }

export interface SecondaryPanelConfig {
  id: string
  title: string
  description?: string | null
  content: React.ReactNode
  actions?: SecondaryPanelAction[]
}

interface SecondaryPanelController {
  openPanel: (config: SecondaryPanelConfig) => void
  closePanel: () => void
  activePanelId: string | null
}

const SecondaryPanelContext = React.createContext<SecondaryPanelController | null>(null)

export function useSecondaryPanel() {
  const ctx = React.useContext(SecondaryPanelContext)
  if (!ctx) throw new Error("useSecondaryPanel must be used within SecondaryPanelProvider")
  return ctx
}

export function SecondaryPanelProvider({ children }: { children: React.ReactNode }) {
  const [panel, setPanel] = React.useState<SecondaryPanelConfig | null>(null)
  const lastFocusRef = React.useRef<HTMLElement | null>(null)

  const openPanel = React.useCallback((config: SecondaryPanelConfig) => {
    const active = (document.activeElement as HTMLElement | null) ?? null
    lastFocusRef.current = active
    setPanel(config)
  }, [])

  const closePanel = React.useCallback(() => {
    setPanel(null)
  }, [])

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (open) return
      setPanel(null)
      const toFocus = lastFocusRef.current
      lastFocusRef.current = null
      if (toFocus) {
        queueMicrotask(() => toFocus.focus())
      }
    },
    []
  )

  const controller = React.useMemo<SecondaryPanelController>(
    () => ({
      openPanel,
      closePanel,
      activePanelId: panel?.id ?? null,
    }),
    [openPanel, closePanel, panel?.id]
  )

  return (
    <SecondaryPanelContext.Provider value={controller}>
      {children}
      <Drawer open={Boolean(panel)} onOpenChange={handleOpenChange} direction="right">
        <DrawerContent className="focus:outline-none">
          <DrawerHeader className="gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <DrawerTitle className="truncate">{panel?.title}</DrawerTitle>
                {panel?.description ? (
                  <DrawerDescription className="line-clamp-2">{panel.description}</DrawerDescription>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close panel"
                onClick={() => handleOpenChange(false)}
                autoFocus
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>
          <Separator />
          <div className="p-4 space-y-4">
            <div>{panel?.content}</div>
            {panel?.actions?.length ? (
              <div className="space-y-2">
                <div className="text-sm font-semibold">Actions</div>
                <div className="flex flex-col gap-2">
                  {panel.actions.map(action => {
                    if (action.kind !== "custom") {
                      return (
                        <Button
                          asChild
                          key={action.id}
                          variant="outline"
                          className="justify-start"
                        >
                          <a
                            href={action.href}
                            target={action.target ?? "_blank"}
                            rel={action.rel ?? "noreferrer"}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {action.label}
                          </a>
                        </Button>
                      )
                    }

                    return (
                      <Button
                        key={action.id}
                        variant="outline"
                        className="justify-start"
                        onClick={async () => {
                          await action.onSelect()
                        }}
                      >
                        {action.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </DrawerContent>
      </Drawer>
    </SecondaryPanelContext.Provider>
  )
}
