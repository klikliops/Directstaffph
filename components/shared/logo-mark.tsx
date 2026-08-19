import Image from "next/image";

export function Logo({
  className = "h-8 w-auto",
}: {
  className?: string;
  // Unused now that the mark is a static asset -- kept so existing call
  // sites (Navbar, Footer, sidebars, DashboardTopbar) don't need edits.
  gradientId?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt="DirectStaffPH"
      width={120}
      height={120}
      className={className}
      priority
    />
  );
}
