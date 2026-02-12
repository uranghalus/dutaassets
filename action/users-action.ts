'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { withContext } from '@/lib/action-utils';

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
  return withContext(async () => {
    const username = formData.get('username')?.toString();
    const role = formData.get('role')?.toString();
    const employeeId = formData.get('employeeId')?.toString();

    if (!username || !role || !employeeId) {
      throw new Error('Missing required fields: Username, Role, and Employee are required.');
    }

    // 1. Fetch Employee Data
    const employee = await prisma.karyawan.findUnique({
      where: { id_karyawan: employeeId },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    // 2. Generate Unique Email
    let email = `${username}@dutaverse.com`;
    let finalUsername = username;
    let counter = 1;

    // Check for duplicates and generate alternative
    while (await prisma.user.findFirst({ where: { email } })) {
      finalUsername = `${username}${counter}`;
      email = `${finalUsername}@dutaverse.com`;
      counter++;
    }

    // 3. Prepare User Data
    const name = employee.nama;
    const password = employee.no_ktp; // Use KTP as initial password

    // 4. Create User via Better Auth
    const newUser = await auth.api.createUser({
      body: {
        name,
        email,
        password,
        role: role as "user" | "admin",
      },
      headers: await headers(),
    });

    if (!newUser?.user) {
      throw new Error('Failed to create user');
    }

    // 5. Post-creation updates (Verify email, set username, link employee)
    await prisma.user.update({
      where: { id: newUser.user.id },
      data: {
        emailVerified: true,
        username: finalUsername
      },
    });

    // Link Employee
    await prisma.karyawan.update({
      where: { id_karyawan: employeeId },
      data: { userId: newUser.user.id },
    });

    revalidatePath('/users');
    return newUser;
  });
}

/* =======================
   UPDATE
======================= */
export async function updateUser(userId: string, formData: FormData) {
  return withContext(async () => {
    const username = formData.get('username')?.toString();
    const role = formData.get('role')?.toString();
    const employeeId = formData.get('employeeId')?.toString();
    const password = formData.get('password')?.toString();

    const updateData: any = {};
    if (role) updateData.role = role;

    // 1. Handle Username / Email Update
    let finalUsername = username;
    if (username) {
      // Check if username is different from current? Use simple logic: update if provided.
      // Generate email
      let email = `${username}@dutaverse.com`;

      // Check uniqueness is tricky on update without current user context, 
      // but let's assume if it fails, it fails.
      // Or we can query current user.
      const currentUser = await prisma.user.findUnique({ where: { id: userId } });
      if (currentUser?.username !== username) {
        // check if email taken
        const existing = await prisma.user.findFirst({
          where: { email, id: { not: userId } }
        });
        if (existing) {
          throw new Error("Username already taken");
        }
        updateData.email = email;
      } else {
        finalUsername = undefined; // No change
      }
    }

    // 2. Update User via Better Auth
    await auth.api.adminUpdateUser({
      body: {
        userId,
        data: updateData,
      },
      headers: await headers(),
    });

    // Update Prisma-only fields (username)
    if (finalUsername) {
      await prisma.user.update({
        where: { id: userId },
        data: { username: finalUsername }
      });
    }

    // Update Password if provided
    if (password) {
      await auth.api.setUserPassword({
        body: {
          userId,
          newPassword: password,
        },
        headers: await headers()
      });
    }

    // 3. Handle Employee Link Update and Name Sync
    const currentLink = await prisma.karyawan.findFirst({
      where: { userId },
    });

    if (employeeId) {
      if (currentLink?.id_karyawan !== employeeId) {
        // Unlink old
        if (currentLink) {
          await prisma.karyawan.update({
            where: { id_karyawan: currentLink.id_karyawan },
            data: { userId: null }
          });
        }

        // Fetch new employee
        const newEmployee = await prisma.karyawan.findUnique({
          where: { id_karyawan: employeeId }
        });

        if (newEmployee) {
          // Link new
          await prisma.karyawan.update({
            where: { id_karyawan: employeeId },
            data: { userId },
          });

          // Sync Name to User
          await prisma.user.update({
            where: { id: userId },
            data: { name: newEmployee.nama }
          });
        }
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
  });
}

/* =======================
   DELETE
======================= */
export async function deleteUser(userId: string) {
  return withContext(async () => {
    // 1. Delete via Better Auth (this cascades usually, but let's be safe)
    await auth.api.removeUser({
      body: { userId },
      headers: await headers(),
    });

    // Prisma relation 'onDelete: SetNull' in schema handles the Karyawan userId cleanup automatically.

    revalidatePath('/users');
  });
}

/* =======================
   BAN / UNBAN
======================= */
export async function toggleBanUser(userId: string, isBanned: boolean, reason?: string) {
  return withContext(async () => {
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
  });
}
