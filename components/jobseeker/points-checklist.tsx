"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Check, Circle, ImagePlus, Upload } from "lucide-react";
import { updateProfile, type MockUser } from "@/lib/local-auth";
import { JOBSEEKER_MAX_POINTS, JOBSEEKER_POINT_TASKS, calculatePoints } from "@/lib/points";

const AVATAR_SWATCHES = [
  { from: "from-cyan-400", to: "to-blue-500" },
  { from: "from-fuchsia-400", to: "to-cyan-400" },
  { from: "from-teal-400", to: "to-emerald-500" },
  { from: "from-sky-400", to: "to-indigo-500" },
  { from: "from-amber-400", to: "to-pink-500" },
  { from: "from-violet-400", to: "to-cyan-400" },
];

export function PointsChecklist({
  session,
  onUpdate,
}: {
  session: MockUser;
  onUpdate: (user: MockUser) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const points = calculatePoints(session, JOBSEEKER_POINT_TASKS);

  function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const updated = updateProfile(session.email, {
      resumeSubmitted: true,
      resumeFileName: file.name,
    });
    if (updated) onUpdate(updated);
  }

  function handlePickAvatar(swatch: { from: string; to: string }) {
    const updated = updateProfile(session.email, {
      profilePictureSet: true,
      avatarColorFrom: swatch.from,
      avatarColorTo: swatch.to,
    });
    if (updated) {
      onUpdate(updated);
      setShowAvatarPicker(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-brand-navy">
          Complete your profile
        </h2>
        <span className="text-sm font-semibold text-brand-accent-dark">
          {points} / {JOBSEEKER_MAX_POINTS} pts
        </span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-accent transition-all"
          style={{ width: `${Math.round((points / JOBSEEKER_MAX_POINTS) * 100)}%` }}
        />
      </div>

      <ul className="mt-4 divide-y divide-slate-100">
        {JOBSEEKER_POINT_TASKS.map((task) => {
          const done = task.done(session);
          return (
            <li
              key={task.key}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-2.5">
                {done ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-accent text-brand-navy">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-slate-300" />
                )}
                <span
                  className={`text-sm ${done ? "text-slate-500 line-through" : "text-slate-700"}`}
                >
                  {task.label}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs font-medium text-slate-400">
                  +{task.points} pts
                </span>

                {!done && task.key === "resume" && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-brand-navy transition-colors hover:bg-slate-50"
                    >
                      <Upload className="h-3 w-3" />
                      Upload
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleResumeChange}
                    />
                  </>
                )}

                {!done && task.key === "profilePicture" && (
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-brand-navy transition-colors hover:bg-slate-50"
                  >
                    <ImagePlus className="h-3 w-3" />
                    Add
                  </button>
                )}

                {!done && (task.key === "fullName" || task.key === "jobInterest") && (
                  <span className="text-xs text-slate-400">
                    Use the form above
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {session.resumeFileName && (
        <p className="mt-2 text-xs text-slate-500">
          Resume on file: {session.resumeFileName}
        </p>
      )}

      {showAvatarPicker && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-brand-navy">
            Pick an avatar color
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {AVATAR_SWATCHES.map((swatch) => (
              <button
                key={swatch.from}
                type="button"
                onClick={() => handlePickAvatar(swatch)}
                className={`h-10 w-10 rounded-full bg-gradient-to-br ${swatch.from} ${swatch.to} ring-2 ring-white transition-transform hover:scale-105`}
                aria-label="Choose this avatar color"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
