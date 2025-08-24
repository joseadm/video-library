import React from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
export interface SearchFormProps {
  q?: string;
  tag?: string;
  from?: string;
  to?: string;
  perPage: number;
}

export function SearchForm({ q, tag, from, to, perPage }: SearchFormProps) {
    const router = useRouter(); // Move this to top level


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
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3"
      id="search-form"
    >
      <input type="hidden" name="perPage" value={String(perPage)} />

      <div className="flex flex-col gap-1">
        <label htmlFor={fromId} className="text-sm leading-none text-[#181111]">
          Start Date
        </label>
        <input
        id={fromId}
          type="date"
          name="from"
          defaultValue={from}
          className="h-10 w-40 rounded-lg bg-[#f4f0f0] px-4 text-[#181111] placeholder:text-[#886364] border-none focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor={toId} className="text-sm leading-none text-[#181111]">
          End Date
        </label>
        <input
          id={toId}
          type="date"
          name="to"
          defaultValue={to}
          className="h-10 w-40 rounded-lg bg-[#f4f0f0] px-4 text-[#181111] placeholder:text-[#886364] border-none focus:outline-none"
        />
      </div>

      <label htmlFor={tagId} className="sr-only">
        Tag
      </label>
      <input
        id={tagId}
        name="tag"
        defaultValue={tag}
        placeholder="Tag"
        className="h-10 rounded-lg bg-[#f4f0f0] px-4 text-[#181111] placeholder:text-[#886364] border-none focus:outline-none"
      />

      <label htmlFor={qId} className="sr-only">
        Search by Title
      </label>
      <input
        id={qId}
        name="q"
        defaultValue={q}
        placeholder="Search by Title"
        className="h-10 rounded-lg bg-[#f4f0f0] px-4 text-[#181111] placeholder:text-[#886364] border-none focus:outline-none"
      />

      <button
        type="submit"
        aria-label="Search"
        className="btn btn-primary flex h-10 w-10 items-center justify-center"
      >
        <Search />
      </button>
    </form>
  );
}
