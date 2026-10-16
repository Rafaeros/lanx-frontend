import { tokenStorage } from "@/shared/api/client";
import { hasStoredSession } from "@/features/auth/lib/jwt";
import { LandingHeader } from "../components/landing-header";
import { LandingHero } from "../components/landing-hero";
import { ModulesOverview } from "../components/modules-overview";
import { LandingFooter } from "../components/landing-footer";

export function LandingPage() {
  const isAuthenticated = typeof window !== "undefined" && hasStoredSession(tokenStorage.get);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader isAuthenticated={isAuthenticated} />
      <main className="flex-1 bg-grid">
        <LandingHero isAuthenticated={isAuthenticated} />
        <ModulesOverview />
      </main>
      <LandingFooter />
    </div>
  );
}
