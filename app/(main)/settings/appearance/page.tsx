"use client";

import { useColor } from "@/context/color-provider";
import { useTheme } from "@/context/theme-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const colorOptions = [
  {
    name: "Zinc",
    value: "zinc",
    class: "bg-zinc-900 border-zinc-900",
    darkClass: "dark:bg-zinc-100 dark:border-zinc-100",
  },
  {
    name: "Blue",
    value: "blue",
    class: "bg-blue-600 border-blue-600",
    darkClass: "dark:bg-blue-600 dark:border-blue-600",
  },
  {
    name: "Green",
    value: "green",
    class: "bg-green-600 border-green-600",
    darkClass: "dark:bg-green-600 dark:border-green-600",
  },
  {
    name: "Red",
    value: "red",
    class: "bg-red-600 border-red-600",
    darkClass: "dark:bg-red-600 dark:border-red-600",
  },
  {
    name: "Orange",
    value: "orange",
    class: "bg-orange-500 border-orange-500",
    darkClass: "dark:bg-orange-500 dark:border-orange-500",
  },
] as const;

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const { color, setColor } = useColor();

  return (
    <div className="space-y-6 flex-1 w-full max-w-2xl px-2">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application. Automatically switches
          between day and night themes.
        </p>
      </div>
      <Separator />
      <div className="space-y-8">
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Theme</h4>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className={cn(
                "h-auto flex flex-col items-center justify-center p-4 border-2 shadow-sm rounded-xl transition-all",
                theme === "light"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-accent/50",
              )}
              onClick={() => setTheme("light")}
            >
              <div className="flex h-12 w-full items-center justify-center rounded-md bg-zinc-100 border border-zinc-200 shadow-sm mb-3">
                <div className="h-6 w-6 rounded-full bg-white shadow-sm border border-zinc-200"></div>
              </div>
              <span className="font-medium">Light</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "h-auto flex flex-col items-center justify-center p-4 border-2 shadow-sm rounded-xl transition-all",
                theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-accent/50",
              )}
              onClick={() => setTheme("dark")}
            >
              <div className="flex h-12 w-full items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 shadow-sm mb-3">
                <div className="h-6 w-6 rounded-full bg-zinc-800 shadow-sm border border-zinc-700"></div>
              </div>
              <span className="font-medium">Dark</span>
            </Button>
            <Button
              variant="outline"
              className={cn(
                "h-auto flex flex-col items-center justify-center p-4 border-2 shadow-sm rounded-xl transition-all",
                theme === "system"
                  ? "border-primary bg-primary/5"
                  : "hover:bg-accent/50",
              )}
              onClick={() => setTheme("system")}
            >
              <div className="flex h-12 w-full flex-row overflow-hidden rounded-md border border-zinc-200 shadow-sm mb-3">
                <div className="flex-1 bg-zinc-100 flex items-center justify-center border-r border-zinc-200"></div>
                <div className="flex-1 bg-zinc-900 flex items-center justify-center border-l-0"></div>
              </div>
              <span className="font-medium">System</span>
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Color Strategy</h4>
          <p className="text-sm text-muted-foreground">
            Select your primary color preferences.
          </p>
          <div className="flex flex-wrap gap-4">
            {colorOptions.map((opt) => {
              const isActive = color === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setColor(opt.value)}
                  className={cn(
                    "group flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                    isActive ? "border-primary" : "border-transparent",
                  )}
                  aria-label={`Select ${opt.name} color`}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
                      opt.class,
                      opt.darkClass,
                    )}
                  >
                    {isActive && (
                      <Check className="h-5 w-5 text-white dark:text-zinc-900" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
