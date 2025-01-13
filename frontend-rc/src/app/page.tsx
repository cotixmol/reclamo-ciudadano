// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e4047d] mb-6">
          Welcome to Reclamo Ciudadano
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8">
          Empowering citizens to report and resolve issues in their communities.
          Together, we can create better neighborhoods.
        </p>
        <Link href="/models/claims/pages">
          <button className="px-6 py-3 bg-[#e4047d] text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-[#ff4da6] transition-all duration-300">
            View Claims
          </button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Report Issues Easily
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Submit reports about issues in your community with just a few
            clicks. From potholes to streetlights, your voice matters.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Track Progress
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Stay informed about the status of your claims and see how they are
            being resolved step by step.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Make a Difference
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Join a community of proactive citizens working together to improve
            their surroundings.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>
          Made with <span className="text-red-500">&hearts;</span> by Reputación
          Digital
        </p>
      </footer>
    </div>
  );
}
