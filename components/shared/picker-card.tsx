"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type PickerCardProps = {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  size?: "default" | "large";
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

export function PickerCard({
  icon: Icon,
  title,
  subtitle,
  href,
  onClick,
  size = "default",
}: PickerCardProps) {
  const sizeClasses = SIZE_CLASSES[size];
  const cardClasses = `group flex w-full flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white text-center shadow-sm transition-all hover:-translate-y-1 hover:border-brand-accent hover:shadow-xl ${sizeClasses.card}`;

  const content = (
    <>
      <span
        className={`flex items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-cyan-50 ${sizeClasses.icon}`}
      >
        <Icon className={`text-brand-accent-dark ${sizeClasses.iconGlyph}`} strokeWidth={2} />
      </span>
      <h2 className={`font-bold text-brand-navy ${sizeClasses.title}`}>{title}</h2>
      <p className={`text-slate-500 ${sizeClasses.subtitle}`}>{subtitle}</p>
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
