'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/get-session';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

/* =======================
   GET TEAM MEMBERS
======================= */
export async function getTeamMembers(teamId: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const members = await prisma.teamMember.findMany({
    where: {
      teamId,
    },
    include: {
      user: true, // Explicitly include user
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return members;
}

/* =======================
   GET ORG MEMBERS (For Select)
======================= */
export async function getOrgMembers() {
    const session = await getServerSession();
    if (!session) throw new Error('Unauthorized');
    
    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) throw new Error('No active organization');
  
    const members = await auth.api.listMembers({
      query: {
        organizationId: organizationId,
        limit: 100 // Adjust limit as needed or implement search
      },
      headers: await headers(),
    });
  
    return members?.members || [];
}

/* =======================
   ADD MEMBER
======================= */
export async function addTeamMember(teamId: string, userId: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const result = await auth.api.addTeamMember({
    body: {
      teamId,
      userId,
    },
    headers: await headers(),
  });

  if (!result) throw new Error('Failed to add member');

  revalidatePath(`/teams/${teamId}/members`);
  return result;
}

/* =======================
   REMOVE MEMBER
======================= */
export async function removeTeamMember(teamId: string, userId: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');

  const result = await auth.api.removeTeamMember({
    body: {
      teamId,
      userId,
    },
    headers: await headers(),
  });

  if (!result) throw new Error('Failed to remove member');

  revalidatePath(`/teams/${teamId}/members`);
  return result;
}
