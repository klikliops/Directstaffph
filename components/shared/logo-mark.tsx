// The mark itself carries the navy-to-cyan gradient (not a background
// tile with a white icon on top) -- an SVG gradient needs a unique id
// per instance, so callers must pass one whenever more than one Logo
// could ever render on the same page (e.g. Navbar + Footer).
export function Logo({
  className = "h-8 w-auto",
  gradientId,
}: {
  className?: string;
  gradientId: string;
}) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="18"
          y1="10"
          x2="84"
          y2="110"
        >
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <rect x="18" y="10" width="16" height="100" rx="4" fill={`url(#${gradientId})`} />
      <path
        d="M34 10 A50 50 0 0 1 34 110"
        stroke={`url(#${gradientId})`}
        strokeWidth="16"
        fill="none"
      />
      <polygon points="34,40 34,80 72,60" fill={`url(#${gradientId})`} />
    </svg>
  );
}
