"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
interface SortSelectProps {
  defaultValue: string;
}

export function SortSelect({ defaultValue }: SortSelectProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(window.location.search);
    params.set("sort", e.target.value);
    params.set("page", "1");
    const query = params.toString();
    window.location.href = query ? `/?${query}` : "/";
  }

  return (
    <div className="w-32">
      <div className="relative">
        <select
          name="sort"
          defaultValue={defaultValue}
          onChange={handleChange}
          className="w-full pl-3 text-sm appearance-none cursor-pointer h-10 rounded-lg bg-[#f4f0f0] px-4 pr-6 text-[#181111] border-none focus:outline-none font-bold"
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
