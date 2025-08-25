"use client";

import Image from "next/image";
import { useState } from "react";
import { PLACEHOLDER_URL } from "@/lib/constants";

interface Props {
  title: string;
  thumbnail_url: string;
  created_at: string;
  tags: string[];
}

export function VideoCard({ title, thumbnail_url, created_at, tags }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const src = hasError ? PLACEHOLDER_URL : thumbnail_url;

  return (
    <li className="flex flex-col gap-2">
      <div className="rounded-lg overflow-hidden bg-white">
        <div className="relative w-full aspect-video">
          {!loaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
          <Image
            src={src}
            alt="thumbnail"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setHasError(true);
              setLoaded(true);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-medium leading-tight line-clamp-2" title={title}>
          {title}
        </div>
        <div className="text-xs text-gray-600">Created: {new Date(created_at).toISOString().slice(0, 10)}</div>
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-600 text-white rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );
} 