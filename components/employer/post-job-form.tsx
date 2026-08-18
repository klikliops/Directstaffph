"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CANDIDATE_CATEGORIES, PRIMARY_SOFTWARE_TOOLS, type CandidateCategory, type SoftwareTool } from "@/lib/types";
import { createJob } from "@/lib/jobs-store";
import type { MockUser } from "@/lib/local-auth";

export function PostJobForm({ session }: { session: MockUser }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState<CandidateCategory>(CANDIDATE_CATEGORIES[0]);
  const [employmentType, setEmploymentType] = useState<"Full-time" | "Part-time">("Full-time");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [skills, setSkills] = useState<SoftwareTool[]>([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  function toggleSkill(skill: SoftwareTool) {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !companyName.trim()) {
      setError("Enter a job title and company name.");
      return;
    }
    const min = Number(salaryMin);
    const max = Number(salaryMax);
    if (!min || !max || min > max) {
      setError("Enter a valid salary range.");
      return;
    }
    if (!description.trim()) {
      setError("Add a short description.");
      return;
    }

    const job = createJob({
      title: title.trim(),
      companyName: companyName.trim(),
      category,
      employmentType,
      monthlySalaryMinUsd: min,
      monthlySalaryMaxUsd: max,
      requiredSkills: skills,
      isRemote: true,
      description: description.trim(),
      postedByEmail: session.email,
    });

    router.push(`/employer/jobs/${job.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Job Title
          </span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Shopify E-commerce Ops Manager"
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Company Name
          </span>
          <input
            type="text"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="e.g. Northbound Apparel Co."
            className={inputClasses}
          />
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Category
          </span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as CandidateCategory)}
            className={inputClasses}
          >
            {CANDIDATE_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Employment Type
          </span>
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {(["Full-time", "Part-time"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setEmploymentType(option)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  employmentType === option
                    ? "bg-white text-brand-navy shadow-sm"
                    : "text-slate-500 hover:text-brand-navy"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Min Monthly Salary (USD)
          </span>
          <input
            type="number"
            value={salaryMin}
            onChange={(event) => setSalaryMin(event.target.value)}
            placeholder="1200"
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-600">
            Max Monthly Salary (USD)
          </span>
          <input
            type="number"
            value={salaryMax}
            onChange={(event) => setSalaryMax(event.target.value)}
            placeholder="1800"
            className={inputClasses}
          />
        </label>
      </div>

      <div className="mt-4">
        <span className="mb-1.5 block text-sm font-medium text-slate-600">
          Required Skills
        </span>
        <div className="flex flex-wrap gap-2">
          {PRIMARY_SOFTWARE_TOOLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                skills.includes(skill)
                  ? "bg-brand-accent text-brand-navy"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-slate-600">
          Description
        </span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder="What will this person be doing day to day?"
          className={inputClasses}
        />
      </label>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="mt-5 rounded-full bg-brand-accent px-6 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-cyan-300"
      >
        Post Job
      </button>
    </form>
  );
}

const inputClasses =
  "w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy focus:border-brand-accent focus:outline-none";
