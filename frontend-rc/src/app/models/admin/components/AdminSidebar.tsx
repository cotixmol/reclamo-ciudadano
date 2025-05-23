'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiMap, FiBarChart2, FiX } from 'react-icons/fi';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import '@/app/i18n';

interface AdminSidebarProps {
  closeSidebar: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ closeSidebar }) => {
  const pathname = usePathname();
  const { t } = useTranslation('admin');

  const navItems: NavItem[] = [
    {
      name: t('table', 'Reclamos'),
      href: '/admin/panel/table',
      icon: FiGrid,
    },
    { name: t('map', 'Mapa'), href: '/admin/panel/map', icon: FiMap },
    {
      name: t('charts', 'Gráficos'),
      href: '/admin/panel/charts',
      icon: FiBarChart2,
    },
  ];

  return (
    <aside className="flex flex-col h-full bg-RCColors-700 text-RCColors-100 shadow-lg">
      <div className="p-4 py-5.5 lg:py-6.5 flex justify-between items-center border-b border-RCColors-600">
        <Link
          href="/admin/panel"
          onClick={closeSidebar}
          className="focus:outline-none"
        >
          <Image
            src="/logo_RD_new_blanco.png"
            alt="Reputación Digital Logo"
            width={176}
            height={32}
            className="object-contain"
            priority
          />
        </Link>
        <button
          onClick={closeSidebar}
          className="md:hidden text-RCColors-300 hover:text-primary focus:outline-none"
          aria-label={t('closeMenu', 'Cerrar Menú')}
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>
      <nav className="mt-4 flex-1 px-4 lg:px-6 overflow-y-auto">
        <ul className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            let isActive = pathname === item.href;

            // Special handling so that /admin/panel is not marked active if we are in a subroute.
            if (item.href === '/admin/panel') {
              isActive = pathname === item.href;
            } else {
              isActive = pathname.startsWith(item.href);
            }

            return (
              <li key={item.name} className="mb-1">
                <Link
                  href={item.href}
                  onClick={closeSidebar}
                  className={`
                    flex items-center py-2.5 px-3 rounded-md
                    transition-all duration-200 ease-in-out
                    group
                    outline-none
                    ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-RCColors-100 hover:bg-RCColors-600 hover:text-white'
                    }
                  `}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 shrink-0 ${
                      isActive
                        ? 'text-white'
                        : 'text-RCColors-300 group-hover:text-white'
                    }`}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Sidebar footer */}
      <div className="p-4 border-t border-RCColors-600 mt-auto">
        <p className="text-xs text-center text-RCColors-400">
          {t('adminFooter', 'Panel de administración')}
        </p>
        {process.env.NEXT_PUBLIC_VERSION && (
          <p className="text-xs text-center text-RCColors-400 mt-1">
            v.{process.env.NEXT_PUBLIC_VERSION}
          </p>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
