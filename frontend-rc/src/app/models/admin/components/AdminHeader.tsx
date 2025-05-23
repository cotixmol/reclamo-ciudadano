'use client';

import React from 'react';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import '@/app/i18n';
import Link from 'next/link';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { t } = useTranslation('admin');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-20 flex w-full bg-RCColors-900 drop-shadow-sm border-b border-RCColors-800">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-sm md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Menu button for mobile/tablet */}
          <button
            onClick={onToggleSidebar}
            aria-controls="sidebar"
            aria-expanded={isSidebarOpen}
            className="block rounded-sm border border-RCColors-700 bg-RCColors-800 p-1.5 shadow-sm hover:bg-RCColors-700 focus:outline-none focus:ring-2 focus:ring-primary md:hidden"
            // Hidden on large screens (md:hidden) where the sidebar is visible permanently
            aria-label={
              isSidebarOpen
                ? t('closeMenu', 'Cerrar menú')
                : t('openMenu', 'Abrir menú')
            }
          >
            {isSidebarOpen ? (
              <FiX className="w-5 h-5 text-RCColors-200" />
            ) : (
              <FiMenu className="w-5 h-5 text-RCColors-200" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 2xl:gap-7">
          <ul className="flex items-center gap-2 2xl:gap-4">
            <li>
              <LanguageSwitcher />
            </li>
          </ul>

          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-RCColors-100">
                  Admin User
                </span>
                <span className="block text-xs text-RCColors-400">
                  Superadmin
                </span>
              </span>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white lg:h-10 lg:w-10">
                A {/* Placeholder for initials or an image */}
              </div>
              <FiChevronDown
                className={`hidden fill-current sm:block text-RCColors-400 ${isUserDropdownOpen ? 'transform rotate-180' : ''}`}
              />
            </button>

            {/* User dropdown */}
            {isUserDropdownOpen && (
              <div
                className="absolute right-0 mt-2.5 flex w-60 flex-col rounded-md border border-RCColors-700 bg-RCColors-800 shadow-lg"
                onMouseLeave={() => setIsUserDropdownOpen(false)} // Optional: close when the mouse leaves the view.
              >
                <Link
                  href="#"
                  className="px-4 py-2 text-sm text-RCColors-200 hover:bg-RCColors-700 hover:text-primary"
                >
                  Perfil
                </Link>
                <Link
                  href="#"
                  className="px-4 py-2 text-sm text-RCColors-200 hover:bg-RCColors-700 hover:text-primary"
                >
                  Configuración
                </Link>
                <button className="px-4 py-2 text-left text-sm text-RCColors-200 hover:bg-RCColors-700 hover:text-primary">
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
