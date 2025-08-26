import React from "react";
import { useRouter } from "next/navigation";
import { SortSelect } from "@/components/sort-select";

export interface SearchFormProps {
  q?: string;
  tag?: string;
  from?: string;
  to?: string;
  perPage: number;
  sort?: string;
}

export function SearchForm({
  q,
  tag,
  from,
  to,
  perPage,
  sort,
}: SearchFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Build new search params
    const newParams = new URLSearchParams();

    // Add all form values
    const q = formData.get("q") as string;
    const tag = formData.get("tag") as string;
    const from = formData.get("from") as string;
    const to = formData.get("to") as string;

    if (q) newParams.set("q", q);
    if (tag) newParams.set("tag", tag);
    if (from) newParams.set("from", from);
    if (to) newParams.set("to", to);

    // Reset to page 1 when searching
    newParams.set("page", "1");
    newParams.set("perPage", String(perPage));

    // Navigate to new URL
    router.push(`/?${newParams.toString()}`);
  };

  const fromId = "from-input";
  const toId = "to-input";
  const tagId = "tag-input";
  const qId = "q-input";

  return (
    <form onSubmit={handleSubmit} className="w-full" id="search-form">
      <input type="hidden" name="perPage" value={String(perPage)} />

      <div className="grid grid-cols-2 gap-3 items-end md:grid-cols-6">
        {/* Sort Select */}
        <div className="col-span-1">
          <SortSelect defaultValue={sort || "desc"} />
        </div>

        {/* Tag */}
        <div className="col-span-1">
          <input
            id={tagId}
            name="tag"
            defaultValue={tag}
            placeholder="Tag"
            className="h-10 w-full rounded-lg bg-[#f4f0f0] px-4 text-[#181111] placeholder:text-[#886364] border-none focus:outline-none"
          />
        </div>

        {/* Start Date */}
        <div className="col-span-1">
          <label
            htmlFor={fromId}
            className="text-sm leading-none text-[#181111]"
          >
            Start Date
          </label>
          <input
            id={fromId}
            type="date"
            name="from"
            defaultValue={from}
            className="h-10 w-full rounded-lg bg-[#f4f0f0] px-4 text-[#181111] placeholder:text-[#886364] border-none focus:outline-none"
          />
        </div>

        {/* End Date */}
        <div className="col-span-1">
          <label htmlFor={toId} className="text-sm leading-none text-[#181111]">
            End Date
          </label>
          <input
            id={toId}
            type="date"
            name="to"
            defaultValue={to}
            className="h-10 w-full rounded-lg bg-[#f4f0f0] px-4 text-[#181111] placeholder:text-[#886364] border-none focus:outline-none"
          />
        </div>

        {/* Search by Title */}
        <div className="col-span-2 md:col-span-1">
          <input
            id={qId}
            name="q"
            defaultValue={q}
            placeholder="Search by Title"
            className="h-10 w-full rounded-lg bg-[#f4f0f0] px-4 text-[#181111] placeholder:text-[#886364] border-none focus:outline-none"
          />
        </div>

        {/* Apply Button */}
        <div className="col-span-2 md:col-span-1">
          <button
            type="submit"
            className="btn btn-primary h-10 w-full md:px-6 md:whitespace-nowrap"
          >
            Apply
          </button>
        </div>
      </div>
    </form>
  );
}
