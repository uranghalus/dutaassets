"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "@/context/theme-provider"
import { useEffect, useState } from "react"

export function FloatingThemeMenu() {
    const { theme, resolvedTheme, setTheme } = useTheme()
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    const itemClass =
        "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {open && (
                <div className="mb-2 rounded-lg border bg-background shadow-lg">
                    <button
                        className={itemClass}
                        onClick={() => setTheme("light")}
                    >
                        <Sun className="h-4 w-4" /> Light
                    </button>

                    <button
                        className={itemClass}
                        onClick={() => setTheme("dark")}
                    >
                        <Moon className="h-4 w-4" /> Dark
                    </button>

                    <button
                        className={itemClass}
                        onClick={() => setTheme("system")}
                    >
                        <Monitor className="h-4 w-4" /> System
                    </button>
                </div>
            )}

            <button
                onClick={() => setOpen(!open)}
                className="
          flex h-11 w-11 items-center justify-center
          rounded-full border bg-background shadow-lg
          transition hover:scale-105
        "
            >
                {resolvedTheme === "dark" ? <Moon /> : <Sun />}
            </button>
        </div>
    )
}
