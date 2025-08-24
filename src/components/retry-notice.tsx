"use client";

import React from "react";

export function RetryNotice({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
      <h2 className="text-xl font-semibold text-[#181111]">There was an error</h2>
      <p className="text-sm text-[#886364]">{message}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="btn btn-secondary btn-md px-4 py-2"
        aria-label="Retry"
      >
        Retry
      </button>
    </div>
  );
}
