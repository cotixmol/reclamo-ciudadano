'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiAlertCircle, FiHome, FiList } from 'react-icons/fi';
import '../i18n';
import { useTranslation } from 'react-i18next';

const BottomNavBar = () => {
  const { t } = useTranslation('bottomnavbar');
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed z-10 bottom-0 left-0 w-full bg-gray-900 text-gray-200 shadow-lg shadow-black/30 border-t border-primary">
      <div className="grid grid-cols-3 items-center py-6">
        {/* Left: Home */}
        <Link
          href="/"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/') ? 'scale-125' : 'scale-100'
          } transition-transform duration-200`}
        >
          <FiHome
            className={`w-6 h-6 ${
              isActive('/') ? 'text-primary' : 'text-gray-400'
            }`}
          />
          <span className={`text-sm ${isActive('/') ? 'text-primary' : ''}`}>
            {t('homeButtom')}
          </span>
        </Link>

        {/* Center: Plus */}
        <Link
          href="/models/claims/pages/create"
          className="flex items-center mx-auto bg-primary rounded-full p-4 hover:bg-primary-hover transition-colors duration-200"
        >
          <FiAlertCircle className="w-10 h-10" />
        </Link>

        {/* Right: My Claims */}
        <Link
          href="/models/claims/pages"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/models/claims/pages') ? 'scale-125' : 'scale-100'
          } transition-transform duration-200`}
        >
          <FiList
            className={`w-6 h-6 ${
              isActive('/models/claims/pages')
                ? 'text-primary'
                : 'text-gray-400'
            }`}
          />
          <span
            className={`text-sm ${
              isActive('/models/claims/pages') ? 'text-primary' : ''
            }`}
          >
            {t('myClaimsButtom')}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavBar;
