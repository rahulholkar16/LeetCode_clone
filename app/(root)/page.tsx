import { CategoriesSection } from "@/modules/home/components/CategoriesSection";
import { CTASection } from "@/modules/home/components/CTASection";
import { FeaturesGrid } from "@/modules/home/components/FeaturesGrid";
import { HeroSection } from "@/modules/home/components/HeroSection";

export default function Home() {
  return (
      <div className="min-h-screen">
          <HeroSection />
          <FeaturesGrid />
          <CategoriesSection />
          <CTASection />
      </div>
  );
}
