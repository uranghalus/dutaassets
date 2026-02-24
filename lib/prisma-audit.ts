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
            console.log(`[AuditExtension] Operation: ${operation}, Model: ${model}, OrgContext: ${context.organizationId}`);
            
            // Only log if we have an organizationId (don't log public/system actions without org context)
            if (context.organizationId) {
              const actionName = `${operation.toUpperCase()}_${model.toUpperCase()}`;
              
              // Extract entity ID if possible
              const entityId = 
                (args as any).where?.id || 
                (result as any)?.id || 
                (args as any).where?.id_barang || 
                (result as any)?.id_barang ||
                (args as any).where?.id_department ||
                (result as any)?.id_department ||
                (args as any).where?.id_divisi ||
                (result as any)?.id_divisi ||
                (args as any).where?.id_karyawan ||
                (result as any)?.id_karyawan;
              
              const logData = {
                organizationId: context.organizationId,
                userId: context.userId,
                action: actionName,
                entityType: model,
                entityId: typeof entityId === "string" ? entityId : undefined,
                details: args ? JSON.parse(JSON.stringify(args)) : {}, 
                ipAddress: context.ipAddress,
                userAgent: context.userAgent,
              };

              // Await for diagnostic purposes, in production this could be fire-and-forget
              try {
                await (client as any).activityLog.create({
                  data: logData,
                });
                console.log(`[AuditExtension] Successfully logged ${actionName} for ${model}`);
              } catch (err: any) {
                console.error("[AuditExtension] Error saving activity log:", err);
              }
            } else {
              console.warn(`[AuditExtension] Skip logging ${operation} ${model}: Missing organizationId.`);
            }
          }

          return result;
        },
      },
    },
  });
});
