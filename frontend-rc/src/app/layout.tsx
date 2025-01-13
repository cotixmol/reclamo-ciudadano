import type { Metadata } from "next";
import "./globals.css";
import BottomNavBar from "./models/claims/components/BottomNavBar";

export const metadata: Metadata = {
  title: "Reclamo Ciudadano - Reporta problemas en tu ciudad",
  description:
    "Reporta problemas en tu ciudad y sigue el estado de los reclamos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        {children}
        <BottomNavBar />
      </body>
    </html>
  );
}
