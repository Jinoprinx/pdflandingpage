import { EmailCaptureForm } from "@/components/email-capture-form"
import { CheckCircle, Users, Lightbulb, GraduationCap } from "lucide-react"
import { LeadMagnetCard } from "@/components/lead-magnet-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "AI Education & Upskilling | AI Mastery for Entrepreneurs",
    description: "Download our comprehensive curriculum to train your team on generative AI tools and future-proof your workforce.",
}

export default function AiEducationPage() {
    const benefits = [
        {
            icon: <Users className="h-6 w-6 text-primary" />,
            title: "Team Implementation",
            description: "Strategies for getting buy-in from your team and overcoming resistance to AI adoption."
        },
        {
            icon: <GraduationCap className="h-6 w-6 text-primary" />,
            title: "Skill Assessment",
            description: "A framework to evaluate your team's current AI literacy and identify key gaps to fill."
        },
        {
            icon: <Lightbulb className="h-6 w-6 text-primary" />,
            title: "Future-Proofing",
            description: "Prepare your workforce for the next wave of AI advancements so you stay competitive."
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
                                Future-Proof Your Team with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#E5C079]">AI Education</span>
                            </h1>

                            <p className="text-lg text-gray-300 leading-relaxed max-w-xl">
                                Don't let your workforce fall behind. Download our "AI Education & Upskilling Guide" to build a high-performance team for the AI era.
                                <span className="block mt-2 font-medium text-white">Empower your employees to innovate.</span>
                            </p>

                            <div className="pt-4 space-y-3">
                                {[
                                    "Comprehensive Training Curriculum",
                                    "Team Assessment Frameworks",
                                    "Adoption Strategy Templates"
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
                                    title="AI Upskilling Guide 2024"
                                    description="The blueprint for building an AI-ready workforce."
                                    pages={30}
                                    format="PDF Guide"
                                    ctaText="Get the Guide"
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
                        <p className="text-gray-600">Practical strategies to transform your team into AI power users.</p>
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
                    title="Download Your Free Education Guide"
                    description="Enter your email below to get the Upskilling Guide delivered to your inbox instantly."
                    defaultPdf="education"
                    source="ai_education_lp"
                    showSocialProof={true}
                />
            </div>

        </main>
    )
}
