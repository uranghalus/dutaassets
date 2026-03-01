export async function seedRoles(prisma: any) {
  console.log("🔐 Seeding organization roles...");

  const org = await prisma.organization.findFirst();
  if (!org) throw new Error("Organization not found");

  const roles = [
    {
      role: "manager",
      permission: {
        role: ["create", "read", "edit", "delete"],
        ac: ["create", "read", "edit", "delete"],
        asset: ["create", "read", "update", "maintenance"],
      },
    },
    {
      role: "supervisor",
      permission: {
        role: ["read"],
        ac: ["read"],
        asset: ["read", "update"],
      },
    },
    {
      role: "staff_lapangan",
      permission: {
        asset: ["read", "maintenance"],
      },
    },
    {
      role: "staff_administrasi",
      permission: {
        asset: ["create", "read", "update"],
      },
    },
    {
      role: "finance_manager",
      permission: {
        role: ["read"],
        ac: ["read"],
        asset: ["read", "transfer.approve"],
      },
    },
    {
      role: "staff_asset",
      permission: {
        asset: ["read", "maintenance"],
      },
    },
  ];

  for (const r of roles) {
    await prisma.organizationRole.upsert({
      where: {
        organizationId_role: {
          organizationId: org.id,
          role: r.role,
        },
      },
      update: {
        permission: JSON.stringify(r.permission),
      },
      create: {
        id: crypto.randomUUID(),
        organizationId: org.id,
        role: r.role,
        permission: JSON.stringify(r.permission),
      },
    });
  }

  console.log("✅ Roles seeded");
}
