import { Suspense } from 'react';
import ProfileForm from '@/components/profile/ProfileForm';

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfileForm userId={resolvedParams.id} />
    </Suspense>
  );
}