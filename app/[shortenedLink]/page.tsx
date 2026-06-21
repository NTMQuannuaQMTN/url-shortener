'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ShortenedLinkPage() {
  const params = useParams();
  const code = Array.isArray(params?.shortenedLink)
    ? params.shortenedLink[0]
    : params?.shortenedLink;
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    if (!code) {
      setStatus("Invalid shortened URL.");
      return;
    }

    const fetchOriginalUrl = async () => {
      setStatus("Looking up shortened URL...");

      try {
        const response = await fetch(`/api/short-urls?code=${encodeURIComponent(code)}`);
        const result = await response.json();

        if (!response.ok) {
          setStatus(result?.error || "Could not resolve shortened URL.");
          return;
        }

        if (!result?.original_url) {
          setStatus("Original URL not found.");
          return;
        }

        window.location.href = result.original_url;
      } catch (error) {
        setStatus("Network error while resolving shortened URL.");
      }
    };

    fetchOriginalUrl();
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Redirecting...
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{status}</p>
      </div>
    </div>
  );
}
