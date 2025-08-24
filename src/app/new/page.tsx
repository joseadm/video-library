"use client";

import Link from "next/link";
import { FormField } from "@/components/form-field";
import { useNewVideoForm } from "@/hooks/use-new-video-form";
import { Save, ArrowLeft } from "lucide-react";

export default function NewVideoPage() {
  const { onSubmit } = useNewVideoForm({ onSuccessRedirect: "/" });

  return (
    <div className="max-w-xl mx-auto min-h-[60vh] flex flex-col justify-center">
      <div className="flex items-center gap-3 mb-2">
        <Link
          href="/"
          aria-label="Back"
          className="h-10 w-10 rounded-full bg-[#f4f0f0] text-[#181111] flex items-center justify-center hover:bg-[#ebe7e7]"
        >
          <ArrowLeft />
        </Link>
        <h1 className="text-2xl font-semibold text-[#181111]">
          Add a New Video
        </h1>
      </div>
      <p className="text-sm text-[#886364] mb-4">
        Title is required. Tags are optional (comma-separated).
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormField>
          <FormField.Label required>Title</FormField.Label>
          <FormField.Control
            name="title"
            required
            placeholder="Enter a title"
          />
        </FormField>

        <FormField>
          <FormField.Label>Tags (comma-separated)</FormField.Label>
          <FormField.Control name="tags" placeholder="e.g. music, travel" />
        </FormField>

        <FormField>
          <FormField.Label>Thumbnail URL</FormField.Label>
          <FormField.Control name="thumbnail_url" placeholder="https://..." />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormField.Label>Duration (seconds)</FormField.Label>
            <FormField.Control
              type="number"
              min="0"
              name="duration"
              placeholder="120"
            />
          </FormField>
          <FormField>
            <FormField.Label>Views</FormField.Label>
            <FormField.Control
              type="number"
              min="0"
              name="views"
              placeholder="0"
            />
          </FormField>
        </div>

        <div className="flex items-center gap-3 justify-end mt-4">
          <button
            type="submit"
            className="btn btn-primary px-4 h-10 flex items-center gap-2"
          >
            Save
            <Save />
          </button>
          <Link href="/" className="btn btn-secondary px-4 h-10 flex items-center ">
            Cancel
          </Link>
        </div>

        <FormField.Message>
          If any fields are left empty, defaults will be applied: placeholder
          thumbnail, current date, 120s duration, 0 views.
        </FormField.Message>
      </form>
    </div>
  );
}
