'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminTablePage() {
  const router = useRouter();
  const clientPublicId = process.env.NEXT_PUBLIC_CLIENT_PUBLIC_ID;

  useEffect(() => {
    if (clientPublicId) {
      router.push(`/admin/${clientPublicId}/table`);
    }
  }, [clientPublicId, router]);

  return null;
}
