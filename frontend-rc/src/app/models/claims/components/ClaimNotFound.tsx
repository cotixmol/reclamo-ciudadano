"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

const ClaimNotFoundPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-112px)] bg-gray-900 text-gray-200 px-4">
      <FiSearch className="text-[#e4047d] w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold text-gray-100 mb-2">
        No Claims Available
      </h1>
      <p className="text-gray-400 mb-6 text-center">
        There are currently no claims to display. You can return to the previous
        page or create a new claim to get started.
      </p>
      <button
        onClick={() => router.back()}
        className="bg-[#e4047d] text-white px-6 py-3 rounded-full shadow-md hover:bg-[#ff4da6] transition duration-200"
      >
        Go Back
      </button>
    </div>
  );
};

export default ClaimNotFoundPage;
