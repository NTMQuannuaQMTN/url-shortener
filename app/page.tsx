'use client';

import { useState } from "react";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function shortenURL(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const trimmedOriginal = originalUrl.trim();
    const trimmedShortened = shortenedUrl.trim();

    if (!trimmedOriginal || !trimmedShortened) {
      setError("Please enter both the original URL and the short code.");
      return;
    }

    const normalizedOriginal = /^https?:\/\//i.test(trimmedOriginal)
      ? trimmedOriginal
      : `https://${trimmedOriginal}`;

    setLoading(true);

    const response = await fetch("/api/short-urls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original_url: normalizedOriginal,
        shortened_url: trimmedShortened,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Unable to shorten URL, maybe the short code is already taken.");
      return;
    }

    setMessage(`Shortened URL created: ${window.location.origin}/${trimmedShortened}`);
    setOriginalUrl("");
    setShortenedUrl("");
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
        URL Shortener
      </h1>
      <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={shortenURL}>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Enter a URL to shorten
          </h2>
          <input
            value={originalUrl}
            onChange={(event) => setOriginalUrl(event.target.value)}
            type="url"
            placeholder="Enter a URL"
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black px-3 py-2 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Enter a short code
          </h2>
          <input
            value={shortenedUrl}
            onChange={(event) => setShortenedUrl(event.target.value)}
            type="text"
            placeholder="Enter a short code"
            className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black px-3 py-2 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-700">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
