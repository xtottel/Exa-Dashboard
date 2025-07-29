// lib/auth.ts
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function getUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect('/auth/signin');
  }

  return user;
}

export async function requireAdmin() {
  const user = await getUser();
  if (!user || user.role !== 'admin') {
    redirect('/auth/signin');
  }

  return user;
}
