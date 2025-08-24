"use client";

import { useCallback, type FormEvent } from "react";
import toast from "react-hot-toast";
import type { CreateVideoInput } from "@/types";

export interface UseNewVideoFormOptions {
  onSuccessRedirect?: string;
}

interface NewVideoPayload extends CreateVideoInput {
  thumbnail_url?: string;
  duration?: number;
  views?: number;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function useNewVideoForm(options: UseNewVideoFormOptions = {}) {
  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      const title = (formData.get("title") as string)?.trim();
      if (!title) {
        toast.error("Title is required");
        return;
      }
      const tagsRaw = (formData.get("tags") as string) || "";
      const payload: NewVideoPayload = {
        title,
        tags: tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const thumbnail_url = (formData.get("thumbnail_url") as string) || "";
      const durationStr = (formData.get("duration") as string) || "";
      const viewsStr = (formData.get("views") as string) || "";

      if (thumbnail_url && !isValidUrl(thumbnail_url)) {
        toast.error("Thumbnail URL must be a valid URL");
        return;
      }

      if (durationStr) {
        const n = Number(durationStr);
        if (!Number.isFinite(n) || n < 0) {
          toast.error("Duration must be a non-negative number");
          return;
        }
        payload.duration = n;
      }

      if (viewsStr) {
        const n = Number(viewsStr);
        if (!Number.isFinite(n) || n < 0) {
          toast.error("Views must be a non-negative number");
          return;
        }
        payload.views = n;
      }

      if (thumbnail_url) payload.thumbnail_url = thumbnail_url;

      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }).then(async (res) => {
        if (!res.ok) {
          const { error } = await res
            .json()
            .catch(() => ({ error: "Failed to create" }));
          throw new Error(error || "Failed to create");
        }
        return res.json();
      }).catch(() => {
        // Handle network errors (like when server is down)
        throw new Error("Failed to save");
      });

      try {
        await toast.promise(promise, {
          loading: "Saving...",
          success: "Video created",
          error: (e) => e.message,
        });
        if (options.onSuccessRedirect) {
          window.location.href = options.onSuccessRedirect;
        }
      } catch (error) {
        console.error(error);
      }
    },
    [options.onSuccessRedirect]
  );
  return { onSubmit } as const;
}
