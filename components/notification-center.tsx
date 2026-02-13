"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  getPendingNotifications,
  AppNotification,
} from "@/action/notification-action";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getPendingNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
    // Poll every 30 seconds for a "real-time" feel without WebSockets
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const count = notifications.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center p-0 text-[10px] font-bold"
            >
              {count}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="text-sm font-semibold text-foreground">
            Notifications
          </h4>
          <span className="text-xs text-muted-foreground">{count} Pending</span>
        </div>
        <ScrollArea className="h-72">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">All caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    router.push(n.url);
                  }}
                  className="flex flex-col gap-1 p-4 text-left border-b hover:bg-muted/50 transition-colors w-full"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase text-primary tracking-wider">
                      {n.type.replace("_", " ")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(n.date), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">{n.title}</span>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {n.message}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
