'use client';

import AdminHeader from '@/app/models/admin/components/AdminHeader';
import AdminSidebar from '@/app/models/admin/components/AdminSidebar';
import React, { useState } from 'react';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-RCColors-900 text-RCColors-200">
      {/* Sidebar for desktop (always visible) and mobile devices (state-controlled) */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-RCColors-800 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block md:border-r md:border-RCColors-700`}
      >
        <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Admin panel header */}
        <AdminHeader
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-RCColors-900 p-6">
          {children}
        </main>
      </div>

      {/* Overlay to close the sidebar on mobile when you click out */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
