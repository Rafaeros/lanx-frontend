import { tokenStorage } from "@/shared/api/client";
import { hasStoredSession } from "@/features/auth/lib/jwt";
import { LandingHeader } from "../components/landing-header";
import { LandingHero } from "../components/landing-hero";
import { AboutSection } from "../components/about-section";
import { JourneySection } from "../components/journey-section";
import { StatsSection } from "../components/stats-section";
import { ModulesOverview } from "../components/modules-overview";
import { CtaSection } from "../components/cta-section";
import { LandingFooter } from "../components/landing-footer";
import { BackToTop } from "../components/back-to-top";

export function LandingPage() {
  const isAuthenticated = typeof window !== "undefined" && hasStoredSession(tokenStorage.get);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader isAuthenticated={isAuthenticated} />
      <main className="flex-1">
        <LandingHero isAuthenticated={isAuthenticated} />
        <AboutSection />
        <StatsSection />
        <JourneySection />
        <ModulesOverview />
        <CtaSection isAuthenticated={isAuthenticated} />
      </main>
      <LandingFooter />
      <BackToTop />
    </div>
  );
}
