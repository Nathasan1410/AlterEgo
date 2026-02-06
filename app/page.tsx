"use client";

import HeroSection from "@/src/components/landing/HeroSection";
import ProblemSection from "@/src/components/landing/ProblemSection";
import SolutionSection from "@/src/components/landing/SolutionSection";
import WorkflowSection from "@/src/components/landing/WorkflowSection";
import VideosSection from "@/src/components/landing/VideosSection";
import ScreenshotsCarousel from "@/src/components/landing/ScreenshotsCarousel";
import MarketSection from "@/src/components/landing/MarketSection";
import NewCompetitiveSection from "@/src/components/landing/NewCompetitiveSection";
import ComparisonSection from "@/src/components/landing/ComparisonSection";
import TechStackSection from "@/src/components/landing/TechStackSection";
import CTASection from "@/src/components/landing/CTASection";
import SocialLinks from "@/src/components/landing/SocialLinks";
import Waves from "@/components/Waves";

export default function Home() {
  return (
    <main className="relative min-h-screen text-white">
      {/* Background Layer - z-0 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <Waves
          lineColor="#f97316"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
        <div className="pointer-events-none absolute inset-0 bg-black/80" />
      </div>

      {/* Content Layer - z-10 */}
      <div className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <WorkflowSection />
        <VideosSection />
        <ScreenshotsCarousel />
        <MarketSection />
        <NewCompetitiveSection />
        <ComparisonSection />
        <TechStackSection />
        <CTASection />
        <SocialLinks />
      </div>
    </main>
  );
}
