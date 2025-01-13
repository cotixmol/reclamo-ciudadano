"use client";

import React from "react";
import { FiAlertCircle } from "react-icons/fi";

interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
      <div className="text-center p-6 shadow-lg shadow-black/30 bg-gray-800 rounded-lg border-t-4 border-[#e4047d]">
        <FiAlertCircle className="text-[#e4047d] w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h1>
        <p className="text-gray-400 mb-4">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#e4047d] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#ff4da6] transition duration-200"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
