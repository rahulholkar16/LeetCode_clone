"use client";
import { useSession } from "@/modules/auth/hooks/useSession";
import { CategoriesSection } from "@/modules/home/components/CategoriesSection";
import { CTASection } from "@/modules/home/components/CTASection";
import { FeaturesGrid } from "@/modules/home/components/FeaturesGrid";
import { HeroSection } from "@/modules/home/components/HeroSection";

export default function Home() {
  const { isLoading } = useSession();
  if (isLoading) return <div>Loading...</div>;


  return (
      <div className="min-h-screen">
          <HeroSection />
          <FeaturesGrid />
          <CategoriesSection />
          <CTASection />
      </div>
  );
}
