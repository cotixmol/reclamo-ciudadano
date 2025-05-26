// No 'use client' here – this can stay a server component
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Purely render the login page, no header/sidebar
  return <>{children}</>;
}
