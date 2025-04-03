'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layouts/AuthLayout';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthProvider';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (username: string, password: string): Promise<boolean> => {
    try {
      const success = await register(username, password);

      if (success) {
        // The AuthForm component will handle redirect to login on success
        return true;
      } else {
        setError('이미 존재하는 아이디이거나 올바르지 않습니다. 다른 아이디를 사용해주세요.');
        return false;
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('Registration error:', err);
      return false;
    }
  };

  return (
    <AuthLayout
      title="계정 생성"
      description="세일즈원을 시작하기 위해 회원가입을 해주세요"
      showBackButton={true}
      backUrl="/auth/login"
    >
      <AuthForm
        isLogin={false}
        onSubmit={handleRegister}
        error={error}
      />
    </AuthLayout>
  );
}