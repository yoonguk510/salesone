'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  showBackButton = false,
  backUrl = '/',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand/Logo section */}
      <div className="w-full md:w-1/3 bg-primary flex flex-col justify-between p-10 text-white">
        <div>
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold">세일즈원</h1>
          </Link>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-6">세일즈원과 함께 비즈니스를 성장시키세요</h2>
            <p className="text-lg opacity-75">
              리드 생성부터 거래 성사까지, 판매 프로세스를 관리하는 올인원 플랫폼입니다.
            </p>
          </div>
        </div>
        <div className="text-sm opacity-70">
          © {new Date().getFullYear()} 세일즈원. 모든 권리 보유.
        </div>
      </div>

      {/* Right side - Authentication form */}
      <div className="w-full md:w-2/3 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          {showBackButton && (
            <Link href={backUrl} className="inline-flex items-center mb-6 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-4 w-4 mr-1" />
              뒤로
            </Link>
          )}
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {description && <p className="text-gray-500 mt-2">{description}</p>}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;