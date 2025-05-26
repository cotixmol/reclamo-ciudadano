import React from 'react';

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Purely render the login page, no header/sidebar
  return <>{children}</>;
}
