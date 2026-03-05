import { Main } from "@/components/main";
import { getPendingNotifications } from "@/action/notification-action";
import { formatDistanceToNow, format } from "date-fns";
import { Bell, Clock, PackageOpen, Tag, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function NotificationsPage() {
  const notifications = await getPendingNotifications();

  // Group notifications by day (simulated for UI structure)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayNotifs = notifications.filter((n) => new Date(n.date) >= today);
  const earlierNotifs = notifications.filter((n) => new Date(n.date) < today);

  return (
    <Main fixed>
      <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Stay updated with your pending tasks and recent activities.
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20 border-dashed mt-8">
            <div className="h-12 w-12 rounded-full bg-muted/40 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">All caught up!</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              You have no pending approvals or new notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            {todayNotifs.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Today
                </h3>
                <div className="space-y-3">
                  {todayNotifs.map((n) => (
                    <NotificationCard key={n.id} notification={n} />
                  ))}
                </div>
              </section>
            )}

            {earlierNotifs.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Earlier
                </h3>
                <div className="space-y-3">
                  {earlierNotifs.map((n) => (
                    <NotificationCard key={n.id} notification={n} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </Main>
  );
}

function NotificationCard({ notification }: { notification: any }) {
  const isRequisition = notification.type === "REQUISITION_PENDING";
  const isLoan = notification.type === "LOAN_PENDING";
  const isTransfer = notification.type === "TRANSFER_PENDING";

  return (
    <Link href={notification.url}>
      <div className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors shadow-sm">
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            isRequisition
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500"
              : isLoan
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500"
                : isTransfer
                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-500"
                  : "bg-primary/10 text-primary"
          }`}
        >
          {isRequisition ? (
            <PackageOpen className="h-5 w-5" />
          ) : isLoan ? (
            <Tag className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-none">
              {notification.title}
            </p>
            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(notification.date), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-muted-foreground">
              {format(new Date(notification.date), "MMM d, yyyy 'at' h:mm a")}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="font-medium text-primary">
              {notification.type.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
