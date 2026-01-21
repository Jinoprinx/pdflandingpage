import { EmailCaptureForm } from "@/components/email-capture-form"
import { CheckCircle, BookOpen, Target, Zap } from "lucide-react"
import { LeadMagnetCard } from "@/components/lead-magnet-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Business Automation Playbook | AI Mastery for Entrepreneurs",
    description: "Download our step-by-step automation playbook. Save 20+ hours a week by automating your core business operations.",
}

export default function BusinessAutomationPage() {
    const benefits = [
        {
            icon: <Target className="h-6 w-6 text-primary" />,
            title: "Identify Bottlenecks",
            description: "Pinpoint exactly where your business processes are getting stuck and how automation can clear the path."
        },
        {
            icon: <Zap className="h-6 w-6 text-primary" />,
            title: "5 Pre-Built Workflows",
            description: "Instant access to plug-and-play workflows for invoicing, customer onboarding, and social media scheduling."
        },
        {
            icon: <BookOpen className="h-6 w-6 text-primary" />,
            title: "No-Code Implementation",
            description: "You don't need to be a developer. Learn to use tools like Zapier and Make to build powerful automations visually."
        }
    ]

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-[#1A1A1A] text-white py-20 lg:py-28 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#D80000]/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-[#C5A059]/10 to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Column: Copy */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-[#D80000] animate-pulse" />
                                <span className="text-sm font-medium text-gray-200">Limited Time Free Access</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-playfair leading-tight">
                                Automate Your Business & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#E5C079]">Reclaim Your Time</span>
                            </h1>

                            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                                Stop trading time for money. Download the "Business Automation Playbook 2024" and build a business that runs while you sleep.
                                <span className="block mt-2 font-medium text-white">Save an average of 20 hours per week.</span>
                            </p>

                            <div className="pt-4 space-y-3">
                                {[
                                    "Step-by-Step Implementation Guide",
                                    "5 Plug-and-Play Workflow Templates",
                                    "Tool Selection Checklist"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-[#C5A059] flex-shrink-0" />
                                        <span className="text-gray-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Visual Preview */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#D80000] to-[#C5A059] rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                            <div className="relative">
                                <LeadMagnetCard
                                    title="Business Automation Playbook 2024"
                                    description="The complete guide to scaling your operations without hiring more staff."
                                    pages={35}
                                    format="PDF Playbook"
                                    ctaText="Get the Playbook"
                                    downloadUrl="#form-section"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-playfair text-[#1A1A1A] mb-4">What You'll Learn Inside</h2>
                        <p className="text-gray-600">Actionable advice to turn your chaotic operations into a well-oiled machine.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="bg-[#F9F9F7] p-8 rounded-2xl border border-gray-100 hover:border-[#C5A059]/30 transition-colors">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-playfair">{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <div id="form-section" className="bg-[#F9F9F7]">
                <EmailCaptureForm
                    title="Download Your Free Playbook Now"
                    description="Enter your email below to get the Automation Playbook delivered to your inbox instantly."
                    defaultPdf="business"
                    source="business_automation_lp"
                    showSocialProof={true}
                />
            </div>

        </main>
    )
}
