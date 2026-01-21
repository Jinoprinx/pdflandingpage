import { HeroSection } from "@/components/hero-section"
import { FeaturesGrid } from "@/components/features-grid"
import { PdfPreviewCards } from "@/components/pdf-preview-card"
import { EmailCaptureForm } from "@/components/email-capture-form"
import { TrustBadges } from "@/components/trust-badges"
import { FaqSection } from "@/components/faq-section"
import { NewsletterFooter } from "@/components/newsletter-footer"
import { ExitIntentPopup } from "@/components/exit-intent-popup"
import { InlineNewsletterCTA } from "@/components/inline-newsletter-cta"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <HeroSection />
        <PdfPreviewCards />
        <FeaturesGrid />
        <InlineNewsletterCTA
          title="Don't have time to implement this yourself?"
          description="Get our step-by-step automation cheat sheet delivered to your inbox."
          ctaText="Get the Cheat Sheet"
          source="homepage_inline"
        />
        <EmailCaptureForm />
        <TrustBadges />
        <FaqSection />
      </main>
      <NewsletterFooter />
      <ExitIntentPopup />
    </div>
  )
}

