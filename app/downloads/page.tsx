import { LeadMagnetCard } from "@/components/lead-magnet-card"
import { CheckCircle2 } from "lucide-react"

export const metadata = {
    title: "Your Downloads | AI Mastery",
    description: "Access your free AI mastery resources.",
}

export default function DownloadsPage() {
    const resources = [
        {
            title: "Business Automation Playbook",
            description: "Step-by-step workflows to automate your operations and save 20+ hours/week.",
            pages: 25,
            downloadUrl: "/assets/business-automation-playbook.pdf",
        },
        {
            title: "AI Trends Report 2024",
            description: "Strategic analysis of the most important AI developments for business leaders.",
            pages: 18,
            downloadUrl: "/assets/ai-trends-report-2026.pdf",
        },
        {
            title: "AI Education Guide",
            description: "A comprehensive curriculum for upskilling your team on generative AI tools.",
            pages: 32,
            downloadUrl: "/assets/ai-education-guide.pdf",
        },
    ]

    return (
        <main className="min-h-screen bg-[#F9F9F7] py-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-6 text-[#1A1A1A]">
                        You're All Set!
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Thank you for subscribing. Here are the resources we promised. <br className="hidden md:block" />
                        Click the buttons below to download your guides directly.
                    </p>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {resources.map((resource, idx) => (
                        <div key={idx} className="h-full">
                            <LeadMagnetCard
                                title={resource.title}
                                description={resource.description}
                                pages={resource.pages}
                                format="PDF"
                                className="h-full"
                                ctaText="Download PDF"
                                downloadUrl={resource.downloadUrl}
                            />
                        </div>
                    ))}
                </div>

                {/* Support Note */}
                <div className="text-center mt-20 text-gray-500 text-sm">
                    <p>Having trouble downloading? Contact us at support@example.com</p>
                </div>
            </div>
        </main>
    )
}
