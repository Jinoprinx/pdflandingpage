import { Rocket, Lock, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesGrid() {
  const features = [
    {
      icon: <Rocket className="h-10 w-10 text-[#D80000]" />,
      title: "Actionable Hacks",
      description: "Step-by-step fixes, not fluff. Implement in <60 mins.",
    },
    {
      icon: <Lock className="h-10 w-10 text-[#D80000]" />,
      title: "Exclusive Data",
      description: "Includes leaked AI tools Big Tech doesn't want you to use.",
    },
    {
      icon: <Target className="h-10 w-10 text-[#D80000]" />,
      title: "Proven Results",
      description: "Used by 500+ businesses and 50 schools to save time and train talent.",
    },
  ]

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-[#C5A059] mb-3 tracking-wider uppercase">What You Get</p>
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-[#1A1A1A]">
            Built for <span className="text-[#C5A059] italic">Results</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 border-gray-100 hover:border-[#C5A059]/50 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(197,160,89,0.15)] rounded-2xl group"
            >
              <CardHeader className="pb-4">
                <div className="w-16 h-16 rounded-xl bg-[#D80000]/10 flex items-center justify-center mb-4 group-hover:bg-[#D80000] group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-2xl font-playfair text-[#1A1A1A]">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600 leading-relaxed">
                {feature.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
