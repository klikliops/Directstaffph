import type { MockUser } from "./local-auth";

export interface PointTask {
  key: string;
  label: string;
  points: number;
  done: (user: MockUser) => boolean;
}

export const JOBSEEKER_POINT_TASKS: PointTask[] = [
  { key: "account", label: "Create your account", points: 10, done: () => true },
  {
    key: "fullName",
    label: "Add your full name",
    points: 20,
    done: (user) => Boolean(user.firstName) && Boolean(user.lastName),
  },
  {
    key: "jobInterest",
    label: "Select a job interest",
    points: 20,
    done: (user) => Boolean(user.jobInterest),
  },
  {
    key: "profilePicture",
    label: "Add a profile picture",
    points: 20,
    done: (user) => Boolean(user.profilePictureSet),
  },
  {
    key: "resume",
    label: "Submit your resume",
    points: 20,
    done: (user) => Boolean(user.resumeSubmitted),
  },
  {
    key: "videoIntro",
    label: "Add a video intro",
    points: 10,
    done: (user) => Boolean(user.videoIntroSubmitted),
  },
  {
    key: "firstApplication",
    label: "Apply to your first job",
    points: 15,
    done: (user) => Boolean(user.appliedJobIds?.length),
  },
  {
    key: "firstBookmark",
    label: "Bookmark a job you like",
    points: 10,
    done: (user) => Boolean(user.bookmarkedJobIds?.length),
  },
];

export const JOBSEEKER_MAX_POINTS = JOBSEEKER_POINT_TASKS.reduce(
  (sum, task) => sum + task.points,
  0
);

export function calculatePoints(
  user: MockUser | null,
  tasks: PointTask[]
): number {
  if (!user) return 0;
  return tasks.reduce((sum, task) => sum + (task.done(user) ? task.points : 0), 0);
}

// Profile-completion points (calculatePoints, bounded by JOBSEEKER_MAX_POINTS)
// plus accumulated daily check-in points, which have no ceiling. This is the
// number shown as "your score" everywhere outside the profile checklist,
// which needs the bounded, task-only figure for its progress bar.
export function calculateTotalScore(user: MockUser | null): number {
  return calculatePoints(user, JOBSEEKER_POINT_TASKS) + (user?.checkInPoints ?? 0);
}

// Ranks every jobseeker by score, highest first -- shared by the employer
// leaderboard, the talent browse page, and a jobseeker's own dashboard so
// "your rank" and "top jobseekers" always agree on the same ordering.
export function rankJobseekers(
  users: MockUser[]
): { user: MockUser; points: number }[] {
  return users
    .filter((u) => u.role === "jobseeker")
    .map((u) => ({ user: u, points: calculateTotalScore(u) }))
    .sort((a, b) => b.points - a.points);
}
