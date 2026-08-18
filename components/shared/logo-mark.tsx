function LogoGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="5" y="4" width="4" height="16" rx="2" fill="currentColor" />
      <path
        d="M9 4a8 8 0 0 1 0 16"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M9 9v6l5-3-5-3Z" fill="currentColor" />
    </svg>
  );
}

export function LogoMark({
  tileClassName = "h-8 w-8 rounded-lg",
  iconClassName = "h-4.5 w-4.5",
}: {
  tileClassName?: string;
  iconClassName?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-brand-navy via-brand-blue to-brand-accent text-white ${tileClassName}`}
    >
      <LogoGlyph className={iconClassName} />
    </span>
  );
}
