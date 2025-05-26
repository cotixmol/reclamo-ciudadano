'use client';
import React, { useState } from 'react';
import AdminHeader from '@/app/models/admin/components/AdminHeader';
import AdminSidebar from '@/app/models/admin/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-RCColors-900 text-RCColors-200">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-RCColors-800 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out
           md:relative md:translate-x-0 md:block md:border-r md:border-RCColors-700`}
      >
        <AdminSidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto bg-RCColors-900 p-6">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
