// components/BottomNavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNavBar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-gray-200 shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Home Button */}
        <Link href="/" className="flex flex-col items-center space-y-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-6 h-6 ${
              isActive("/") ? "text-[#e4047d]" : "text-gray-400"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l9-9m0 0l9 9m-9-9v18"
            />
          </svg>
          <span className="text-sm">Home</span>
        </Link>

        {/* Create New Claim Button */}
        <Link
          href="/create"
          className="relative z-10 bg-[#e4047d] text-white rounded-full p-4 shadow-lg hover:bg-[#ff4da6] transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>

        {/* My Claims Button */}
        <Link
          href="/my-claims"
          className="flex flex-col items-center space-y-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-6 h-6 ${
              isActive("/my-claims") ? "text-[#e4047d]" : "text-gray-400"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 20.25v-4.5m-9 4.5v-9m13.5 9V12.75m-18 7.5V8.25m13.5 12h-9"
            />
          </svg>
          <span className="text-sm">My Claims</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavBar;
