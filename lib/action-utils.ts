import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requestContext } from "./context";
import { getClientIp } from "./ip-utils";
import { prisma } from "./prisma";

/**
 * Runs a function within a request context populated from the current session.
 * Use this in your server actions to enable automated auditing.
 */
export async function withContext<T>(fn: () => Promise<T>): Promise<T> {
  const headerList = await headers();
  const session = await auth.api.getSession({
    headers: headerList,
  });

  let organizationId = session?.session?.activeOrganizationId;

  // Fallback: If no active organization in session, try to find one from the database
  if (!organizationId && session?.user?.id) {
    console.log(`[withContext] Fallback lookup for user: ${session.user.id}`);
    const employee = await prisma.karyawan.findUnique({
      where: { userId: session.user.id },
      select: { organization_id: true },
    });
    organizationId = employee?.organization_id || null;
    console.log(`[withContext] Fallback resolved organizationId: ${organizationId}`);
  }

  const context = {
    userId: session?.user?.id,
    organizationId,
    ipAddress: getClientIp(headerList),
    userAgent: headerList.get("user-agent") || "unknown",
  };

  return requestContext.run(context, fn);
}
