"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiPlus, FiList } from "react-icons/fi";

const BottomNavBar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed z-10 bottom-0 left-0 w-full bg-gray-900 text-gray-200 shadow-lg shadow-black/30 border-t border-[#e4047d]">
      <div className="flex items-center justify-between px-10 py-6">
        {/* Home Button */}
        <Link
          href="/"
          className={`flex flex-col items-center space-y-1 ${
            isActive("/") ? "scale-125" : "scale-100"
          } transition-transform duration-200`}
        >
          <FiHome
            className={`w-8 h-8 ${
              isActive("/") ? "text-[#e4047d] shadow-pink-500" : "text-gray-400"
            }`}
          />
          <span className={`text-sm ${isActive("/") ? "text-[#e4047d]" : ""}`}>
            Home
          </span>
        </Link>

        {/* Create New Claim Button */}
        <Link
          href="/create"
          className="relative z-10 bg-[#e4047d] text-white rounded-full p-5"
        >
          <FiPlus className="w-8 h-8" />
        </Link>

        {/* My Claims Button */}
        <Link
          href="/models/claims/pages"
          className={`flex flex-col items-center space-y-1 ${
            isActive("/models/claims/pages") ? "scale-125" : "scale-100"
          } transition-transform duration-200`}
        >
          <FiList
            className={`w-8 h-8 ${
              isActive("/models/claims/pages")
                ? "text-[#e4047d] shadow-pink-500"
                : "text-gray-400"
            }`}
          />
          <span
            className={`text-sm ${
              isActive("/models/claims/pages") ? "text-[#e4047d]" : ""
            }`}
          >
            My Claims
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavBar;
