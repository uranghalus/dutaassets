'use server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function requirePermission(permissions: Record<string, string[]>) {
  const result = await auth.api.hasPermission({
    headers: await headers(),
    body: { permissions },
  });

  if (!result.success) {
    throw new Error('Forbidden');
  }
}
