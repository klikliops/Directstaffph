import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { TalentGrid } from "@/components/landing/talent-grid";
import { ValueProps } from "@/components/landing/value-props";
import { PricingSection } from "@/components/landing/pricing-section";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TalentGrid />
        <ValueProps />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
