'use server';

import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';

export async function getDivisis() {
  const session = await getServerSession();
  if (!session) return [];

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) return [];

  const divisis = await prisma.divisi.findMany({
    where: {
      organization_id: organizationId,
    },
    select: {
      id_divisi: true,
      nama_divisi: true,
      department: {
        select: {
            nama_department: true
        }
      }
    },
    orderBy: {
      nama_divisi: 'asc',
    },
  });

  return divisis;
}
