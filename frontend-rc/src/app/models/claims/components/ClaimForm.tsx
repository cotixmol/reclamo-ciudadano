"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/app/components/LoadingScreen";

export default function ClaimForm() {
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [status] = useState<string>("Open");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const body = {
      title,
      description,
      status,
      claim_location: {
        type: "Point",
        coordinates: [parseFloat(latitude), parseFloat(longitude)],
      },
    };

    try {
      await axios.post("/api/claims", body);
      router.push("/models/claims");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full max-w-3xl bg-gray-900 p-8 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 ">Create a Claim</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="latitude">
            Latitude
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            placeholder="Enter latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="longitude">
            Longitude
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            placeholder="Enter longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded text-white transition ${
            isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-primary hover:bg-primary-hover"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
