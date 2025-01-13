"use client";
import "./i18n";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function HomePage() {
  const { t } = useTranslation("homepage"); // Use 'homepage' namespace

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e4047d] mb-6">
          {t("hero.title")}
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          {t("hero.subtitle")}
        </p>
        <Link href="/models/claims/pages">
          <button className="px-6 py-3 bg-[#e4047d] text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-[#ff4da6] transition-all duration-300">
            {t("hero.button")}
          </button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            {t("features.reportIssues.title")}
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {t("features.reportIssues.description")}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            {t("features.trackProgress.title")}
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {t("features.trackProgress.description")}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            {t("features.makeDifference.title")}
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            {t("features.makeDifference.description")}
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>{t("footer.text")}</p>
      </footer>
    </div>
  );
}
