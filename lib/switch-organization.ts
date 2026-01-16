'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { getActiveOrganizationWithRole } from '@/action/organization-action';

export async function switchOrganizationAdminOnly(
  organizationId: string,
  organizationSlug: string
) {
  const { role } = await getActiveOrganizationWithRole();

  if (role !== 'owner' && role !== 'admin') {
    throw new Error('Forbidden: admin only');
  }

  await auth.api.setActiveOrganization({
    headers: await headers(),
    body: {
      organizationId,
      organizationSlug,
    },
  });
}
