'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiList } from 'react-icons/fi';
import { IoAdd } from 'react-icons/io5';
import '../i18n';
import { useTranslation } from 'react-i18next';

const BottomNavBar = () => {
  const { t } = useTranslation('bottomnavbar');
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const plusActive = isActive('/models/claims/pages/create');

  return (
    <nav className="fixed z-10 bottom-0 left-0 w-full bg-RCColors-900 text-RCColors-200 shadow-lg shadow-black/30 border-t border-primary">
      <div className="grid grid-cols-3 items-center py-5">
        {/* Left: Home */}
        <Link
          href="/"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/') ? 'scale-110' : 'scale-100'
          } transition-transform duration-200`}
        >
          <FiHome
            className={`w-6 h-6 ${
              isActive('/') ? 'text-primary' : 'text-RCColors-400'
            }`}
          />
          <span className={`text-sm ${isActive('/') ? 'text-primary' : ''}`}>
            {t('homeButton')}
          </span>
        </Link>

        {/* Center: Plus */}
        <Link
          href="/models/claims/pages/create"
          className={`flex items-center mx-auto rounded-full p-4 transition-colors duration-200 ${
            plusActive
              ? 'bg-RCColors-900 border-2 border-primary'
              : 'bg-primary border-2 hover:bg- RCPink-hover'
          }`}
        >
          <IoAdd className={`w-8 h-8 ${plusActive ? 'text-primary' : ''}`} />
        </Link>

        {/* Right: My Claims */}
        <Link
          href="/models/claims/pages"
          className={`flex flex-col items-center space-y-1 ${
            isActive('/models/claims/pages') ? 'scale-110' : 'scale-100'
          } transition-transform duration-200`}
        >
          <FiList
            className={`w-6 h-6 ${
              isActive('/models/claims/pages')
                ? 'text-primary'
                : 'text-RCColors-400'
            }`}
          />
          <span
            className={`text-sm ${
              isActive('/models/claims/pages') ? 'text-primary' : ''
            }`}
          >
            {t('myClaimsButton')}
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavBar;
