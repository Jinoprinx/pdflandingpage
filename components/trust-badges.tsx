import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Star } from "lucide-react"
import Image from "next/image"

export function TrustBadges() {
  const testimonials = [
    {
      quote: "These hacks saved us 200+ hours. Pure gold!",
      author: "CEO @ApexionLabs",
    },
    {
      quote: "My students built apps faster than I could grade papers!",
      author: "Teacher @UrhoboCollege",
    },
    {
      quote: "Implemented 3 workflows in a day. Game changer!",
      author: "CTO @Cerebrox",
    },
    {
      quote: "We were able to implement a week's workflow in a day. Intelligence on steroids!",
      author: "TechLead @Pivotalogic",
    },
  ]

  const partners = [
    { name: "TechCrunch", logo: "/images/techcrunch.jpg" },
    { name: "EdSurge", logo: "/images/edsurge.jpg" },
    { name: "AI Weekly", logo: "/images/aiweekly.jpg" },
  ]

  return (
    <section className="py-16 md:py-20 bg-white border-y border-[#C5A059]/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Featured In */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-[#C5A059] mb-6 tracking-wider uppercase">As Featured In</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="bg-gray-50 px-8 py-4 rounded-xl border border-gray-100">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} Logo`}
                  width={60}
                  height={45}
                  className="h-10 grayscale hover:grayscale-0 transition-all"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h3 className="text-3xl md:text-4xl font-bold font-playfair text-[#1A1A1A] text-center mb-10">
            Trusted by <span className="text-[#C5A059] italic">Leaders</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-[#C5A059]/5 to-white p-6 rounded-2xl border border-[#C5A059]/10">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#C5A059] text-[#C5A059]" />
                  ))}
                </div>
                <p className="italic mb-4 text-gray-700 leading-relaxed">"{testimonial.quote}"</p>
                <p className="text-sm font-medium text-[#C5A059]">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6">
          <Badge variant="outline" className="text-sm py-2 px-4 flex items-center gap-2 border-[#C5A059]/30 text-gray-700">
            <Shield className="h-4 w-4 text-[#C5A059]" />
            <span>SSL Encryption</span>
          </Badge>
          <Badge variant="outline" className="text-sm py-2 px-4 flex items-center gap-2 border-[#C5A059]/30 text-gray-700">
            <CheckCircle className="h-4 w-4 text-[#C5A059]" />
            <span>GDPR Compliant</span>
          </Badge>
          <Badge variant="outline" className="text-sm py-2 px-4 flex items-center gap-2 border-[#C5A059]/30 text-gray-700">
            <CheckCircle className="h-4 w-4 text-[#C5A059]" />
            <span>Privacy Protected</span>
          </Badge>
        </div>
      </div>
    </section>
  )
}
