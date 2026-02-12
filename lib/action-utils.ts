import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requestContext } from "./context";

/**
 * Runs a function within a request context populated from the current session.
 * Use this in your server actions to enable automated auditing.
 */
export async function withContext<T>(fn: () => Promise<T>): Promise<T> {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  const context = {
    userId: session?.user?.id,
    organizationId: session?.session?.activeOrganizationId,
    ipAddress: headerList.get("x-forwarded-for") || "unknown",
    userAgent: headerList.get("user-agent") || "unknown",
  };

  return requestContext.run(context, fn);
}
