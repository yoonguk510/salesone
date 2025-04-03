'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export interface AuthFormProps {
  isLogin?: boolean;
  onSubmit: (username: string, password: string) => Promise<boolean>;
  isLoading?: boolean;
  error?: string | null;
}

export function AuthForm({
  isLogin = true,
  onSubmit,
  isLoading = false,
  error = null,
}: AuthFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(error);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Combine component state loading with prop loading
  const loading = isLoading || submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    
    try {
      // Call the provided onSubmit handler
      const success = await onSubmit(username, password);
      
      if (success) {
        // If login/register successful and it's a register form, redirect to login
        if (!isLogin) {
          router.push('/auth/login');
        }
        // For login, the parent component should handle the redirect
      } else {
        setFormError(isLogin 
          ? '아이디 또는 비밀번호가 일치하지 않습니다'
          : '회원가입에 실패했습니다. 다시 시도해주세요.'
        );
      }
    } catch (err) {
      setFormError('예기치 않은 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {formError}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="username">아이디</Label>
        <Input
          id="username"
          type="text"
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="pr-10"
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLogin ? '로그인' : '계정 생성'}
      </Button>
      
      <div className="mt-4 text-center text-sm">
        {isLogin ? (
          <p>
            계정이 없으신가요?{' '}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              회원가입
            </Link>
          </p>
        ) : (
          <p>
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              로그인
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}

export default AuthForm;