import { Prisma } from "@/generated/prisma/client";
import { getContext } from "./context";

export const auditExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          // 1. Execute the actual query first
          const result = await query(args);

          // 2. Define which operations we want to log
          const auditOperations = ["create", "update", "delete", "upsert", "deleteMany", "updateMany"];
          
          if (auditOperations.includes(operation) && model !== "ActivityLog") {
            const context = getContext();
            
            // Only log if we have an organizationId (don't log public/system actions without org context)
            if (context.organizationId) {
              const actionName = `${operation.toUpperCase()}_${model.toUpperCase()}`;
              
              // Extract entity ID if possible
              let entityId = (args as any).where?.id || (result as any)?.id;
              
              // We use setTimeout or fire-and-forget to avoid blocking the main UI response
              // but since we are in a server environment, we should ideally await or use a queue.
              // For simplicity here, we use the client's internal activityLog to avoid circular dependencies.
              (client as any).activityLog.create({
                data: {
                  organizationId: context.organizationId,
                  userId: context.userId,
                  action: actionName,
                  entityType: model,
                  entityId: typeof entityId === "string" ? entityId : undefined,
                  details: {
                    args: JSON.parse(JSON.stringify(args)), // Ensure it's serializable
                  },
                  ipAddress: context.ipAddress,
                  userAgent: context.userAgent,
                },
              }).catch((err: any) => console.error("Audit Logging Error:", err));
            }
          }

          return result;
        },
      },
    },
  });
});
