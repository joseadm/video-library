"use client";

import React from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col items-center gap-4 text-center">
      <h2 className="text-xl font-semibold text-[#181111]">Something went wrong</h2>
      <p className="text-sm text-[#886364] max-w-prose">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="btn btn-primary btn-md"
        aria-label="Retry loading"
      >
        Retry
      </button>
    </div>
  );
} 