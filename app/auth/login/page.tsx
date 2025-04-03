'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/layouts/AuthLayout';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthProvider';

// Separate component to handle search params
function LoginContent() {
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log('Already authenticated, redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await login(username, password);
      if (success) {
        console.log('Login successful, redirecting to', callbackUrl);
        // Use replace instead of push for a cleaner navigation
        // This will replace the current history entry instead of adding a new one
        router.replace(decodeURIComponent(callbackUrl));
        return true;
      } else {
        setError('아이디 또는 비밀번호가 일치하지 않습니다. 다시 시도해주세요.');
        return false;
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Login error:', err);
      return false;
    }
  };

  return (
    <AuthForm
      isLogin={true}
      onSubmit={handleLogin}
      error={error}
    />
  );
}

// Loading fallback component
function LoginFallback() {
  return <div>로딩 중...</div>;
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="세일즈원 로그인"
      description="계정 접속을 위해 로그인 정보를 입력해주세요"
    >
      <Suspense fallback={<LoginFallback />}>
        <LoginContent />
      </Suspense>
    </AuthLayout>
  );
}