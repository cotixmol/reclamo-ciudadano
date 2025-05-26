'use client';
import { FaArrowLeft } from 'react-icons/fa';
import '../../i18n';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { AdminLogin } from '@/app/services/login/login';

export default function AdminLoginPage() {
  const { t } = useTranslation('admin');
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await AdminLogin(email, password);
      setEmail('');
      setPassword('');
      router.push(`/admin`);
    } catch (err: any) {
      setError(t('errors.invalidCredentials'));
    }
  };

  return (
    <div className="relative min-h-screen bg-RCColors-900 flex items-center justify-center p-5">
      {/* ← Back to home */}
      <button
        onClick={() => router.push('/')}
        aria-label={t('goBack')}
        className="absolute top-4 left-4 flex items-center space-x-3 text-white hover:text-gray-300 transition"
      >
        <FaArrowLeft size={24} />
        <span className="text-sm">{t('goBack')}</span>
      </button>
      <form
        onSubmit={handleLogin}
        className="bg-RCColors-800 w-full max-w-sm p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">
          {t('loginTitle')}
        </h1>

        {/* email */}
        <label className="block mb-2 text-RCColors-100">{t('email')}</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 rounded text-black outline-none focus:ring-2 focus:ring-primary"
        />

        {/* password */}
        <label className="block mb-2 text-RCColors-100">{t('password')}</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 rounded text-black outline-none focus:ring-2 focus:ring-primary"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-primary font-semibold rounded-lg hover:bg-RCPink-hover transition-all duration-300"
        >
          {t('login')}
        </button>
      </form>
    </div>
  );
}
