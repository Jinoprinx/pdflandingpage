"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, CheckCircle2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Analytics } from "@/lib/analytics/tracker"

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
})

interface InlineNewsletterCTAProps {
    title?: string
    description?: string
    ctaText?: string
    source?: string
    className?: string
}

export function InlineNewsletterCTA({
    title = "Get the weekly AI summary",
    description = "Join 10,000+ entrepreneurs getting our best AI tactics delivered to their inbox.",
    ctaText = "Subscribe Free",
    source = "inline_cta",
    className = "",
}: InlineNewsletterCTAProps) {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    name: "Friend", // Default name for inline forms
                    source: source,
                    pdf_choice: "all", // Default to all
                }),
            })

            if (response.ok) {
                setIsSubmitted(true)
                // Analytics track
                Analytics.trackFormSubmit(source, values.email)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className={`p-8 rounded-2xl bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] border border-[#C5A059]/30 text-center ${className}`}>
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-[#C5A059]/20 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-[#C5A059]" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white font-playfair mb-2">You're on the list!</h3>
                <p className="text-gray-400">Please check your inbox to confirm your subscription.</p>
            </div>
        )
    }

    return (
        <div className={`relative overflow-hidden p-8 md:p-10 rounded-2xl bg-[#1A1A1A] text-white my-12 ${className}`}>
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D80000]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h3 className="text-2xl md:text-3xl font-bold font-playfair mb-3">
                        {title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                        {description}
                    </p>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            {...form.register("email")}
                            placeholder="Enter your email address"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#C5A059] h-12"
                        />
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#C5A059] hover:bg-[#B08D45] text-[#1A1A1A] font-bold h-12"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                            {ctaText}
                        </Button>
                    </div>
                    {form.formState.errors.email && (
                        <p className="text-sm text-[#D80000]">{form.formState.errors.email.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                        Unsubscribe at any time. No spam, ever.
                    </p>
                </form>
            </div>
        </div>
    )
}
