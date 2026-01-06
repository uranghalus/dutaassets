'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { LoginSchema } from '@/schema/auth-schema';
import { ActionState } from '@/types';
import { APIError } from 'better-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

interface AuthPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export async function loginAction(formData: AuthPayload): Promise<ActionState> {
  try {
    const parsed = LoginSchema.safeParse(formData);

    if (!parsed.success) {
      return {
        status: 'error',
        fieldErrors: {
          email: parsed.error.cause,
          password: parsed.error.message,
        },
        message: 'Data login tidak valid',
      };
    }

    const { email, password, rememberMe } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return {
        status: 'error',
        fieldErrors: {
          email: 'Email belum terdaftar',
        },
        message: 'Email belum terdaftar',
      };
    }
    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: rememberMe ?? false,
      },
      headers: await headers(),
      returnStatus: true,
    });
    return {
      status: 'success',
      message: 'Login berhasil',
    };
  } catch (error) {
    if (error instanceof APIError) {
      if (error?.statusCode === 401) {
        return {
          status: 'error',
          fieldErrors: {
            password: 'Password salah',
          },
        };
      }
      if (error?.statusCode === 429) {
        return {
          status: 'error',
          fieldErrors: {
            password: 'Terlalu banyak percobaan login',
          },
        };
      }
      // fallback APIError
      return {
        status: 'error',
        message: error.message,
      };
    }

    return {
      status: 'error',
      message: 'Terjadi kesalahan',
    };
  }
}
