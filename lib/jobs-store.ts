// DEMO-ONLY job postings store, backed by localStorage. Employer-created
// postings live here; MOCK_JOBS (lib/mock-data.ts) are seed/example
// listings with no owning employer account.

import { MOCK_JOBS } from "./mock-data";
import type { JobPosting } from "./types";

const JOBS_KEY = "directstaffph_employer_jobs";
export const JOBS_CHANGE_EVENT = "directstaffph:jobs-change";

function readEmployerJobs(): JobPosting[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(JOBS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as JobPosting[];
  } catch {
    return [];
  }
}

function writeEmployerJobs(jobs: JobPosting[]) {
  window.localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new Event(JOBS_CHANGE_EVENT));
}

// Employer-created postings first so they surface above the seed listings.
export function getAllJobs(): JobPosting[] {
  return [...readEmployerJobs(), ...MOCK_JOBS];
}

export function getJobById(jobId: string): JobPosting | null {
  return getAllJobs().find((job) => job.id === jobId) ?? null;
}

export function getJobsByEmployer(employerEmail: string): JobPosting[] {
  return readEmployerJobs().filter(
    (job) => job.postedByEmail?.toLowerCase() === employerEmail.toLowerCase()
  );
}

export function createJob(
  job: Omit<JobPosting, "id" | "slug" | "postedAt" | "applicantCount">
): JobPosting {
  const id = `ejob_${Date.now()}`;
  const newJob: JobPosting = {
    ...job,
    id,
    slug: id,
    postedAt: new Date().toISOString(),
    applicantCount: 0,
  };
  writeEmployerJobs([...readEmployerJobs(), newJob]);
  return newJob;
}
