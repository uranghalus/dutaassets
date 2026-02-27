"use client";

import { OrganizationProvider } from "@/context/organization-provider";

export function OrganizationProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrganizationProvider>{children}</OrganizationProvider>;
}
