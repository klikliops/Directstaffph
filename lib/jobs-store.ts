// DEMO-ONLY job postings store, backed by localStorage. Everything jobseekers
// browse comes from real employer accounts -- there are no seed/example
// listings mixed in, so every job always resolves to a real postedByEmail.

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

export function getAllJobs(): JobPosting[] {
  return readEmployerJobs();
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

// Only the employer who posted a job can delete it.
export function deleteJob(jobId: string, employerEmail: string): boolean {
  const jobs = readEmployerJobs();
  const job = jobs.find((j) => j.id === jobId);
  if (!job || job.postedByEmail?.toLowerCase() !== employerEmail.toLowerCase()) {
    return false;
  }
  writeEmployerJobs(jobs.filter((j) => j.id !== jobId));
  return true;
}
