import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

import { auth } from "@/lib/auth";
import { Main } from "@/components/main";
import { DialogProvider } from "@/context/dialog-provider";
import { RolesTable } from "./components/roles-table";
import OrgRoleDialogs from "./components/roles-dialog";
import RolesPrimaryButton from "./components/roles-primary-buttons";

export const metadata: Metadata = {
  title: "Role & Permission",
  description: "Halaman Role & Permission",
};

export default async function RolesPage() {
  // 🔐 Server-side guard: hanya role yang punya izin 'role: read' atau 'ac: read'
  // yang bisa mengakses halaman ini (owner & admin)
  const canAccess = await auth.api
    .hasPermission({
      headers: await headers(),
      body: {
        permissions: {
          role: ["read"],
        },
      },
    })
    .then(() => true)
    .catch(() => false);

  if (!canAccess) {
    redirect("/dashboard");
  }

  return (
    <DialogProvider>
      <Main fluid className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Role &amp; Permission
            </h2>
            <p className="text-muted-foreground">
              Kelola Role &amp; Permission organisasi Anda di sini.
            </p>
          </div>
          <RolesPrimaryButton />
        </div>
        <RolesTable />
      </Main>
      <OrgRoleDialogs />
    </DialogProvider>
  );
}
