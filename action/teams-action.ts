'use server';

import { auth } from '@/lib/auth';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { withContext } from '@/lib/action-utils';

/* =======================
   TYPES
======================= */
export type TeamArgs = {
  page: number;
  pageSize: number;
};

/* =======================
   GET (PAGINATION)
======================= */
export async function getTeams({ page, pageSize }: TeamArgs) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const skip = (safePage - 1) * safePageSize;
  const take = safePageSize;

  const [data, total] = await Promise.all([
    prisma.team.findMany({
      where: {
        organizationId: organizationId,
      },
      skip,
      take,
      orderBy: {
        name: 'asc',
      },
      include: {
        divisi: {
            select: {
                nama_divisi: true,
                department: {
                    select: {
                        nama_department: true
                    }
                }
            }
        }
      }
    }),

    prisma.team.count({
      where: {
        organizationId: organizationId,
      },
    }),
  ]);

  return {
    data,
    total,
    pageCount: Math.ceil(total / safePageSize),
    page: safePage,
    pageSize: safePageSize,
  };
}

/* =======================
   GET SINGLE TEAM
======================= */
export async function getTeam(id: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const team = await prisma.team.findFirst({
    where: {
      id,
      organizationId: organizationId,
    },
    include: {
        divisi: {
            select: {
                nama_divisi: true
            }
        }
    }
  });

  return team;
}

/* =======================
   CREATE
======================= */
export async function createTeam(formData: FormData) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error('No active organization');

    const kode_team = formData.get('kode_team')?.toString();
    const name = formData.get('nama_team')?.toString(); // Form still sends nama_team likely, we'll map to name
    const divisi_id = formData.get('divisi_id')?.toString();
    const keterangan = formData.get('keterangan')?.toString() ?? '';

    if (!kode_team || !name || !divisi_id) {
      throw new Error('Required fields are missing');
    }

    // Use auth.api to create team (creates TeamMember automatically)
    const newTeam = await auth.api.createTeam({
      body: {
        name,
        organizationId
      },
      headers: await headers()
    });

    if (!newTeam) throw new Error('Failed to create team');

    // Update with custom fields
    const team = await prisma.team.update({
      where: { id: newTeam.id },
      data: {
        divisi_id,
        kode_team,
        keterangan,
      },
    });

    revalidatePath('/teams');
    return team;
  });
}

/* =======================
   UPDATE
======================= */
export async function updateTeam(
  id: string,
  formData: FormData
) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error('No active organization');

    const team = await prisma.team.findFirst({
      where: {
        id,
        organizationId: organizationId,
      },
    });

    if (!team) throw new Error('Team not found');

    const updated = await prisma.team.update({
      where: {
        id,
      },
      data: {
        kode_team: formData.get('kode_team')?.toString() ?? team.kode_team,
        name: formData.get('nama_team')?.toString() ?? team.name,
        divisi_id: formData.get('divisi_id')?.toString() ?? team.divisi_id,
        keterangan: formData.get('keterangan')?.toString() ?? team.keterangan,
      },
    });

    revalidatePath('/teams');
    return updated;
  });
}

/* =======================
   DELETE
======================= */
export async function deleteTeam(id: string) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error('No active organization');

    const team = await prisma.team.findFirst({
      where: {
        id,
        organizationId: organizationId,
      },
    });

    if (!team) throw new Error('Team not found');

    // Use auth.api to remove team (handles cleanup if any)
    // Or just pure prisma. Auth API removeTeam might require extra perms
    await prisma.team.delete({
      where: {
        id,
      },
    });

    revalidatePath('/teams');
  });
}

/* =======================
   BULK DELETE
======================= */
export async function deleteTeamBulk(ids: string[]) {
  return withContext(async () => {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error('No active organization');

    if (!ids || ids.length === 0) return;

    await prisma.team.deleteMany({
      where: {
        id: { in: ids },
        organizationId: organizationId,
      },
    });

    revalidatePath('/teams');
  });
}
