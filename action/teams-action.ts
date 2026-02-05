'use server';

import { auth } from '@/lib/auth';
import { getServerSession } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

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
        organization_id: organizationId,
      },
      skip,
      take,
      orderBy: {
        nama_team: 'asc',
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
        organization_id: organizationId,
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
   CREATE
======================= */
export async function createTeam(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const kode_team = formData.get('kode_team')?.toString();
  const nama_team = formData.get('nama_team')?.toString();
  const divisi_id = formData.get('divisi_id')?.toString();
  const keterangan = formData.get('keterangan')?.toString() ?? '';

  if (!kode_team || !nama_team || !divisi_id) {
    throw new Error('Required fields are missing');
  }

  const team = await prisma.team.create({
    data: {
      organization_id: organizationId,
      divisi_id,
      kode_team,
      nama_team,
      keterangan,
    },
  });

  revalidatePath('/teams');
  return team;
}

/* =======================
   UPDATE
======================= */
export async function updateTeam(
  id_team: string,
  formData: FormData
) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const team = await prisma.team.findFirst({
    where: {
      id_team,
      organization_id: organizationId,
    },
  });

  if (!team) throw new Error('Team not found');

  const updated = await prisma.team.update({
    where: {
      id_team,
    },
    data: {
      kode_team: formData.get('kode_team')?.toString() ?? team.kode_team,
      nama_team: formData.get('nama_team')?.toString() ?? team.nama_team,
      divisi_id: formData.get('divisi_id')?.toString() ?? team.divisi_id,
      keterangan: formData.get('keterangan')?.toString() ?? team.keterangan,
    },
  });

  revalidatePath('/teams');
  return updated;
}

/* =======================
   DELETE
======================= */
export async function deleteTeam(id_team: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  const team = await prisma.team.findFirst({
    where: {
      id_team,
      organization_id: organizationId,
    },
  });

  if (!team) throw new Error('Team not found');

  await prisma.team.delete({
    where: {
      id_team,
    },
  });

  revalidatePath('/teams');
}

/* =======================
   BULK DELETE
======================= */
export async function deleteTeamBulk(ids: string[]) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) throw new Error('No active organization');

  if (!ids || ids.length === 0) return;

  await prisma.team.deleteMany({
    where: {
      id_team: { in: ids },
      organization_id: organizationId,
    },
  });

  revalidatePath('/teams');
}
