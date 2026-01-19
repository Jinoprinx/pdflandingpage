"use client"

import { ArrowRight, TrendingUp, Clock, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function PdfPreviewCards() {
  const pdfCards = [
    {
      title: "Business Automation",
      icon: <Clock className="h-8 w-8 text-[#D80000]" />,
      badge: "$10k Savings",
      image: "/images/bus.png",
      bullets: ["Automate invoicing in 15 mins.", "Free audit template included."],
      cta: "Save Time",
    },
    {
      title: "AI Trends",
      icon: <TrendingUp className="h-8 w-8 text-[#D80000]" />,
      badge: "2024 Trends",
      image: "/images/ai.png",
      bullets: ["7 under-the-radar AI tools.", "Profit strategies for each trend."],
      cta: "Stay Ahead",
    },
    {
      title: "AI Education",
      icon: <Users className="h-8 w-8 text-[#D80000]" />,
      badge: "Free Curriculum",
      image: "/images/edu.png",
      bullets: ["12 no-code AI project ideas.", "Student success case studies."],
      cta: "Train Talent",
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-[#F9F9F7]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-[#C5A059] mb-3 tracking-wider uppercase">Our Playbooks</p>
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-[#1A1A1A] mb-4">
            Choose Your <span className="text-[#C5A059] italic">Free</span> Playbook
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All three playbooks included in your free download
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pdfCards.map((card, index) => (
            <Card
              key={index}
              className="border-2 border-gray-100 hover:shadow-[0_20px_60px_rgba(197,160,89,0.15)] hover:border-[#C5A059]/50 transition-all duration-300 rounded-2xl overflow-hidden group"
            >
              <CardHeader className="relative pb-4">
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20 font-semibold">
                    {card.badge}
                  </Badge>
                </div>
                <div className="flex justify-center mb-3">{card.icon}</div>
                <CardTitle className="text-2xl text-center font-playfair text-[#1A1A1A]">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="aspect-[4/3] relative mb-6 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={`${card.title} preview`}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <ul className="space-y-3">
                  {card.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <span className="text-[#D80000] font-bold text-lg">•</span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full group/btn border-[#C5A059]/30 hover:border-[#C5A059] hover:bg-[#C5A059]/5 transition-all"
                  onClick={() => {
                    const formElement = document.getElementById("email-form")
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
