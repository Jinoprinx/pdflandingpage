"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { SocialProofBar } from "./social-proof-bar"

const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  company: z.string().optional(),
  role: z.string().optional(),
  primary_interest: z.string().optional(),
  how_heard: z.string().optional(),
  pdf_choice: z.string().min(1, { message: "Please select which PDF you want" }),
})

export function EmailCaptureForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
      primary_interest: "",
      how_heard: "",
      pdf_choice: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          source: "main_form",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSubmitted(true)

        // Track analytics
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_type: "form_submit",
            source: "main_form",
            subscriber_email: values.email,
            metadata: {
              pdf_choice: values.pdf_choice,
            },
          }),
        })
      } else {
        alert(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Subscription error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-12 md:py-16" id="email-form">
      <div className="max-w-3xl mx-auto">
        {/* Social Proof Bar */}
        <SocialProofBar />

        <Card className="border-2 border-gray-100 shadow-[0_20px_60px_rgba(197,160,89,0.15)] rounded-3xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl md:text-4xl font-playfair text-[#1A1A1A]">Get Your Free AI Playbooks</CardTitle>
            <CardDescription className="text-lg mt-3 text-gray-600">Fill out the form below to receive instant access</CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <Alert className="bg-gradient-to-r from-[#C5A059]/10 via-[#C5A059]/5 to-[#C5A059]/10 border-2 border-[#C5A059]/30 rounded-2xl">
                <CheckCircle2 className="h-6 w-6 text-[#C5A059]" />
                <AlertTitle className="text-2xl font-bold text-[#1A1A1A] font-playfair">Check Your Email!</AlertTitle>
                <AlertDescription className="mt-3 text-gray-700 leading-relaxed">
                  <p className="mb-2">
                    We've sent you a <strong className="text-[#C5A059]">confirmation email</strong>. Please click the link to verify your email address and receive your free playbooks.
                  </p>
                  <p className="text-sm text-gray-600">
                    Can't find it? <strong>Check spam</strong> or wait a few minutes.
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#1A1A1A] font-medium">Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" className="h-12 border-gray-200 focus:border-[#C5A059] transition-colors" {...field} />
                          </FormControl>
                          <FormMessage className="text-[#D80000]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#1A1A1A] font-medium">Email *</FormLabel>
                          <FormControl>
                            <Input placeholder="your@email.com" type="email" className="h-12 border-gray-200 focus:border-[#C5A059] transition-colors" {...field} />
                          </FormControl>
                          <FormMessage className="text-[#D80000]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Company (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" className="h-12 border-gray-200 focus:border-[#C5A059] transition-colors" {...field} />
                          </FormControl>
                          <FormMessage className="text-[#D80000]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Role (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-[#C5A059] transition-colors">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="founder">Founder/CEO</SelectItem>
                              <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                              <SelectItem value="business_owner">Business Owner</SelectItem>
                              <SelectItem value="developer">Developer</SelectItem>
                              <SelectItem value="marketer">Marketer</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[#D80000]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="primary_interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Primary Interest (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-[#C5A059] transition-colors">
                                <SelectValue placeholder="What interests you most?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="business_automation">Business Automation</SelectItem>
                              <SelectItem value="ai_trends">AI Trends</SelectItem>
                              <SelectItem value="ai_education">AI Education</SelectItem>
                              <SelectItem value="all">All of the above</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[#D80000]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="how_heard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">How did you hear about us? (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-200 focus:border-[#C5A059] transition-colors">
                                <SelectValue placeholder="Select one" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="search">Google/Search</SelectItem>
                              <SelectItem value="social">Social Media</SelectItem>
                              <SelectItem value="referral">Friend/Referral</SelectItem>
                              <SelectItem value="ad">Advertisement</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[#D80000]" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="pdf_choice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#1A1A1A] font-medium">Which PDF do you want? *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-gray-200 focus:border-[#C5A059] transition-colors">
                              <SelectValue placeholder="Select a PDF" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">All 3 Playbooks</SelectItem>
                            <SelectItem value="business">Business Automation</SelectItem>
                            <SelectItem value="trends">AI Trends</SelectItem>
                            <SelectItem value="education">AI Education</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[#D80000]" />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative inline-flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 group ring-1 ring-[#D80000] text-base font-semibold text-white tracking-tight bg-[#D80000] rounded-full pt-4 pr-8 pb-4 pl-8 shadow-[0_10px_30px_rgba(216,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(216,0,0,0.4)] hover:scale-105"
                  >
                    <span className="relative z-[1]">{isSubmitting ? "Processing..." : "Get Instant Access →"}</span>
                  </button>

                  <div className="text-center text-sm text-gray-600 flex items-center justify-center gap-1.5">
                    <Lock className="h-4 w-4 text-[#C5A059]" />
                    <span>100% Privacy Protected. Unsubscribe anytime.</span>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

