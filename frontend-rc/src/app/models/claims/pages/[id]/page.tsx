"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Claim } from "../../utils/types";
import LoadingScreen from "@/app/components/LoadingScreen";

export default function ClaimDetailsPage() {
  const params = useParams() as { id: string }; // Explicitly cast useParams to include id
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await axios.get<Claim>(`/api/claims/${params.id}`);
        setClaim(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchClaim();
    }
  }, [params.id]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-red-500 min-h-screen flex items-center justify-center">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Claim not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-800 text-gray-200 flex flex-col">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-[#e40c74] hover:text-[#ff4da6] transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/0/05/Burnout_ops_on_Mangum_Fire_McCall_Smokejumpers.jpg"
        alt={claim.title}
        width={800}
        height={500}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h1 className="text-2xl font-semibold text-gray-100 mb-4">
        {claim.title}
      </h1>
      <p className="text-gray-300">{claim.description}</p>

      <div className="mt-6 flex-grow">
        {/* Placeholder for more details or editing features */}
        <div className="p-4 bg-gray-700 rounded-lg">
          <p className="text-gray-400">
            More details or editing section here...
          </p>
        </div>
      </div>
    </div>
  );
}
