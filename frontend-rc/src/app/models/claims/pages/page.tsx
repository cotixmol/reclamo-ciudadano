"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Claim } from "../utils/types";
import ClaimCard from "../components/ClaimCard";

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<Claim[]>("/api/claims");
        console.log("Fetched claims:", response.data);
        setClaims(response.data);
      } catch (error) {
        console.error("Error fetching claims:", error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (isLoading) {
    return (
      <div>
        <p>Loading claims...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 p-6 pt-32">
      {claims.map((claim) => (
        <ClaimCard key={claim.id} claim={claim} />
      ))}
    </div>
  );
}
