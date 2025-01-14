"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Claim } from "../utils/types";
import ClaimCard from "../components/ClaimCard";
import LoadingScreen from "@/app/components/LoadingScreen";
import ErrorPage from "@/app/components/ErrorPage";
import ClaimNotFoundPage from "../components/ClaimNotFound";

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Claim[]>("/api/claims");
        setClaims(response.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  if (!claims || claims.length === 0) {
    return <ClaimNotFoundPage />;
  }

  return (
    <div className="min-h-screen bg-gray-800 p-4 flex justify-center">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {claims.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>
    </div>
  );
}
