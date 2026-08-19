// Core domain types for DirectStaffPH.
// These mirror the shape we intend to persist in Supabase (see setup notes in the
// README this ships with) so the mock data below can be swapped for real queries
// with minimal changes to the components that consume them.

export type CandidateCategory =
  | "E-commerce Ops"
  | "Video Editing"
  | "Executive Assistant"
  | "Finance & Bookkeeping"
  | "Media Buying";

export const CANDIDATE_CATEGORIES: CandidateCategory[] = [
  "E-commerce Ops",
  "Video Editing",
  "Executive Assistant",
  "Finance & Bookkeeping",
  "Media Buying",
];

export type SoftwareTool =
  | "Shopify"
  | "Klaviyo"
  | "QuickBooks"
  | "Xero"
  | "CapCut"
  | "Premiere Pro"
  | "ClickUp"
  | "Notion"
  | "Meta Ads Manager"
  | "Google Ads"
  | "Zendesk"
  | "Canva";

export const PRIMARY_SOFTWARE_TOOLS: SoftwareTool[] = [
  "Shopify",
  "ClickUp",
  "CapCut",
  "Xero",
];

export interface CandidateProfile {
  id: string;
  slug: string;
  fullName: string;
  title: string;
  category: CandidateCategory;
  location: string;
  avatarInitials: string;
  avatarColorFrom: string;
  avatarColorTo: string;
  monthlySalaryUsd: number;
  hourlyRateUsd: number;
  yearsExperience: number;
  softwareSkills: SoftwareTool[];
  hasVideoIntro: boolean;
  idVerified: boolean;
  verifiedScore: number; // 0-100 composite trust score
  bio: string;
  isContactUnlocked: boolean; // resolved per-viewer based on active subscription
  createdAt: string; // ISO date
}

export type JobEmploymentType = "Full-time" | "Part-time" | "Project-based";

export interface JobPosting {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  category: CandidateCategory;
  employmentType: JobEmploymentType;
  monthlySalaryMinUsd: number;
  monthlySalaryMaxUsd: number;
  requiredSkills: SoftwareTool[];
  isRemote: boolean;
  postedAt: string; // ISO date
  applicantCount: number;
  description: string;
  postedByEmail?: string; // employer account that created this posting (undefined for seed/mock listings)
}

export type PricingPlanId = "free" | "business" | "enterprise";

export interface PricingPlan {
  id: PricingPlanId;
  name: string;
  priceUsdPerMonth: number;
  billingNote: string;
  description: string;
  features: string[];
  isMostPopular: boolean;
  ctaLabel: string;
}
