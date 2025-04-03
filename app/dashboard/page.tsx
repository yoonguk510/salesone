'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If auth is not loading anymore and user is not authenticated, redirect to login
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (!loading) {
      // If auth is loaded and user is authenticated, set loading to false
      setIsLoading(false);
    }
  }, [loading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">대시보드 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{user?.username}님, 환영합니다</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="캠페인"
          description="마케팅 캠페인 관리"
          href="/dashboard/campaigns"
        />
        <DashboardCard
          title="리드"
          description="영업 리드 조회 및 관리"
          href="/dashboard/leads"
        />
        <DashboardCard
          title="이메일"
          description="이메일 캠페인 발송 및 추적"
          href="/dashboard/email"
        />
      </div>
    </div>
  );
}

function DashboardCard({ 
  title, 
  description, 
  href 
}: { 
  title: string; 
  description: string; 
  href: string; 
}) {
  const router = useRouter();
  
  return (
    <div 
      className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={() => router.push(href)}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}