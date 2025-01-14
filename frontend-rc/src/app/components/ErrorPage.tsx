"use client";

import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import "../i18n";
import { useTranslation } from "react-i18next";

interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  const { t } = useTranslation("errorpage");

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
      <div className="text-center p-6 shadow-lg shadow-black/30 bg-gray-800 rounded-lg border-t-4 border-primary">
        <FiAlertCircle className="text-primary w-16 h-16 mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
        <p className="text-gray-400 mb-4">{message}</p>
        <button
          onClick={handleReload}
          className="bg-primary text-white px-4 py-2 rounded-full shadow-md hover:bg-primary-hover transition duration-200"
        >
          {t("button")}
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
