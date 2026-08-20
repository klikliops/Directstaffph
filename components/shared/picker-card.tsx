"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type PickerCardProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  size?: "default" | "large";
  // "light" is the plain white card used on light backgrounds (e.g. the
  // /get-started page). "brand" is a glassy, navy/cyan-tinted card for use
  // directly on the dark hero, so it reads as part of the brand gradient
  // instead of a stark white box floating on navy.
  tone?: "light" | "brand";
} & ({ href: string; onClick?: undefined } | { href?: undefined; onClick: () => void });

const SIZE_CLASSES = {
  default: {
    card: "min-h-[220px] p-10",
    icon: "h-16 w-16",
    iconGlyph: "h-8 w-8",
    title: "mt-5 text-xl",
    subtitle: "mt-1.5 text-sm",
  },
  large: {
    card: "min-h-[280px] p-12",
    icon: "h-20 w-20",
    iconGlyph: "h-10 w-10",
    title: "mt-6 text-2xl",
    subtitle: "mt-2 text-base",
  },
};

const TONE_CLASSES = {
  light: {
    card: "border-slate-200 bg-white shadow-sm hover:border-brand-accent hover:shadow-xl",
    icon: "bg-slate-50 group-hover:bg-cyan-50",
    iconGlyph: "text-brand-accent-dark",
    title: "text-brand-navy",
    subtitle: "text-slate-500",
  },
  brand: {
    card: "border-white/15 bg-white/10 shadow-lg shadow-black/20 backdrop-blur-sm hover:border-brand-accent hover:bg-white/[0.14]",
    icon: "bg-white/10 group-hover:bg-white/20",
    iconGlyph: "text-brand-accent",
    title: "text-white",
    subtitle: "text-slate-300",
  },
};

export function PickerCard({
  icon: Icon,
  title,
  subtitle,
  href,
  onClick,
  size = "default",
  tone = "light",
}: PickerCardProps) {
  const sizeClasses = SIZE_CLASSES[size];
  const toneClasses = TONE_CLASSES[tone];
  const cardClasses = `group flex w-full flex-col items-center justify-center rounded-3xl border text-center transition-all hover:-translate-y-1 ${sizeClasses.card} ${toneClasses.card}`;

  const content = (
    <>
      <span
        className={`flex items-center justify-center rounded-2xl transition-colors ${sizeClasses.icon} ${toneClasses.icon}`}
      >
        <Icon className={`${sizeClasses.iconGlyph} ${toneClasses.iconGlyph}`} strokeWidth={2} />
      </span>
      <h2 className={`font-bold ${sizeClasses.title} ${toneClasses.title}`}>{title}</h2>
      <p className={`${sizeClasses.subtitle} ${toneClasses.subtitle}`}>{subtitle}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cardClasses}>
      {content}
    </button>
  );
}
