"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative lg:pt-32 lg:pb-32 pt-28 pb-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/50 to-[#F9F9F7] z-[1]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/40 bg-white/80 text-[#C5A059] text-xs font-medium mb-8 animate-fadeIn shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]"></span>
            </span>
            AI Mastery for Entrepreneurs
          </div>

          {/* Main Heading */}
          <h1 className="sm:text-6xl lg:text-8xl xl:text-9xl leading-tight animate-slideUp text-5xl font-bold tracking-tight text-[#1A1A1A] font-playfair drop-shadow-sm mb-8">
            Transform Your
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C5A059] via-[#b89145] to-[#C5A059] italic">
              Business.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 max-w-2xl mx-auto text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed opacity-0 animate-slideUp font-light drop-shadow-sm" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Get 3 free AI playbooks trusted by 1,000+ entrepreneurs. Learn how to automate workflows, master AI trends, and scale your business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-y-0 sm:space-x-6 opacity-0 animate-slideUp mt-12 space-y-4 items-center justify-center" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <button
              onClick={() => {
                const formElement = document.getElementById("email-form")
                if (formElement) {
                  formElement.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="relative inline-flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 group ring-1 ring-[#D80000] text-base font-semibold text-white tracking-tight bg-[#D80000] rounded-full pt-4 pr-8 pb-4 pl-8 shadow-[0_10px_30px_rgba(216,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(216,0,0,0.4)] hover:scale-105"
            >
              <span className="relative z-[1]">Get Your Free Playbooks</span>
              <ArrowRight className="relative z-[1] w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                const formElement = document.getElementById("email-form")
                if (formElement) {
                  formElement.scrollIntoView({ behavior: "smooth" })
                }
              }}
              className="group inline-flex items-center space-x-3 hover:text-[#C5A059] hover:bg-white transition-all duration-300 text-gray-800 border-gray-400/50 hover:border-[#C5A059] border rounded-full pt-4 pr-8 pb-4 pl-8 bg-white/40 backdrop-blur-md shadow-sm"
            >
              <span>Learn More</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

