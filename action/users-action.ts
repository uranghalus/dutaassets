'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

/* =======================
   TYPES
======================= */
export type UserArgs = {
  page: number;
  pageSize: number;
  search?: string;
};

/* =======================
   GET (LIST WITH PAGINATION)
======================= */
export async function getUsers({ page, pageSize, search }: UserArgs) {
  // 1. Fetch users from Better Auth Admin API
  const result = await auth.api.listUsers({
    query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        searchValue: search, // Corrected from search to searchValue
        searchField: "name",
        sortBy: "createdAt",
        sortDirection: "desc"
    },
    headers: await headers(),
  });
  
  const users = result.users;

  // 2. Fetch linked employees for these users
  const userIds = users.map(u => u.id);
  
  const employees = await prisma.karyawan.findMany({
    where: {
      userId: { in: userIds },
    },
    select: {
      id_karyawan: true,
      userId: true,
      nama: true,
      nik: true,
    },
  });

  const employeeMap = new Map(employees.map(e => [e.userId, e]));

  // 3. Merge data
  const data = users.map(user => ({
    ...user,
    employee: employeeMap.get(user.id) || null,
  }));

  // @ts-ignore
  const total = result.count ?? 0;

  return {
    data,
    total,
    pageCount: Math.ceil(total / pageSize),
    page,
    pageSize,
  };
}

/* =======================
   CREATE
======================= */
export async function createUser(formData: FormData) {
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const role = formData.get('role')?.toString();
  const employeeId = formData.get('employeeId')?.toString();

  if (!name || !email || !password || !role) {
    throw new Error('Missing required fields');
  }

  // 1. Create User via Better Auth
  const newUser = await auth.api.createUser({
    body: {
      name,
      email,
      password,
      role: role as "user" | "admin", // Type Cast

    },
    headers: await headers(),
  });

  if (!newUser?.user) {
    throw new Error('Failed to create user');
  }


  // 1.5 Manually verify email (since we can't pass it to createUser)
  await prisma.user.update({
    where: { id: newUser.user.id },
    data: { emailVerified: true },
  });

  // 2. Link Employee if selected
  if (employeeId) {
    await prisma.karyawan.update({
      where: { id_karyawan: employeeId },
      data: { userId: newUser.user.id },
    });
  }

  revalidatePath('/users');
  return newUser;
}

/* =======================
   UPDATE
======================= */
export async function updateUser(userId: string, formData: FormData) {
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const role = formData.get('role')?.toString();
  const employeeId = formData.get('employeeId')?.toString();

  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;

  // 1. Update User via Better Auth
  await auth.api.adminUpdateUser({
    body: {
      userId,
      data: updateData,
    },
    headers: await headers(),
  });
  
  const password = formData.get('password')?.toString();
  if (password) {
      // Use setUserPassword as suggested by linter (available in recent Better Auth versions)
      await auth.api.setUserPassword({
          body: {
              userId,
              newPassword: password,
          },
          headers: await headers()
      })
  }

  // 2. Handle Employee Link Update
  // Check current link
  const currentLink = await prisma.karyawan.findFirst({
    where: { userId },
  });

  if (employeeId) {
    // If different employee selected
    if (currentLink?.id_karyawan !== employeeId) {
      // Unlink old
      if (currentLink) {
        await prisma.karyawan.update({
            where: { id_karyawan: currentLink.id_karyawan },
            data: { userId: null }
        });
      }
      // Link new
      await prisma.karyawan.update({
        where: { id_karyawan: employeeId },
        data: { userId },
      });
    }
  } else {
    // If no employee selected, but one was linked -> Unlink
    if (currentLink) {
        await prisma.karyawan.update({
            where: { id_karyawan: currentLink.id_karyawan },
            data: { userId: null }
        });
    }
  }

  revalidatePath('/users');
}

/* =======================
   DELETE
======================= */
export async function deleteUser(userId: string) {
  // 1. Delete via Better Auth (this cascades usually, but let's be safe)
  await auth.api.removeUser({
    body: { userId },
    headers: await headers(),
  });
  
  // Prisma relation 'onDelete: SetNull' in schema handles the Karyawan userId cleanup automatically.

  revalidatePath('/users');
}

/* =======================
   BAN / UNBAN
======================= */
export async function toggleBanUser(userId: string, isBanned: boolean, reason?: string) {
  if (isBanned) {
    await auth.api.banUser({
      body: {
        userId,
        banReason: reason,
      },
      headers: await headers(),
    });
  } else {
    await auth.api.unbanUser({
      body: { userId },
      headers: await headers(),
    });
  }

  revalidatePath('/users');
}
