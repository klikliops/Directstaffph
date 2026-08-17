"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  CANDIDATE_CATEGORIES,
  PRIMARY_SOFTWARE_TOOLS,
  type CandidateCategory,
  type SoftwareTool,
} from "@/lib/types";

// Filter state lives here for now. Once wired to Supabase, lift this into a
// URL search param (or a shared store) so the grid below can query with it.
export function SearchFilterBar() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<CandidateCategory | "All">("All");
  const [activeTool, setActiveTool] = useState<SoftwareTool | "All">("All");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by role, skill, or software (e.g. “Shopify EA”)"
          className="w-full bg-transparent text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-2">
          <span className="mr-1 mt-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            Category
          </span>
          <FilterChip
            label="All"
            isActive={activeCategory === "All"}
            onClick={() => setActiveCategory("All")}
          />
          {CANDIDATE_CATEGORIES.map((category) => (
            <FilterChip
              key={category}
              label={category}
              isActive={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-2">
          <span className="mr-1 mt-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            Software
          </span>
          <FilterChip
            label="All"
            isActive={activeTool === "All"}
            onClick={() => setActiveTool("All")}
          />
          {PRIMARY_SOFTWARE_TOOLS.map((tool) => (
            <FilterChip
              key={tool}
              label={tool}
              isActive={activeTool === tool}
              onClick={() => setActiveTool(tool)}
            />
          ))}
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-brand-accent px-5 py-2 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
        >
          Search Talent
        </button>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? "bg-brand-accent text-brand-navy"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
}
