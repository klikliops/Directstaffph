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
    key: "mobile",
    label: "Add your mobile number",
    points: 10,
    done: (user) => Boolean(user.mobileNumber),
  },
  {
    key: "fullName",
    label: "Add your full name",
    points: 15,
    done: (user) => Boolean(user.fullName),
  },
  {
    key: "jobInterest",
    label: "Select a job interest",
    points: 15,
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
    done: () => false,
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
