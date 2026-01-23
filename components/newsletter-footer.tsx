"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Analytics } from "@/lib/analytics/tracker"

const footerFormSchema = z.object({
    name: z.string().min(2, { message: "Please enter your name" }),
    email: z.string().email({ message: "Please enter a valid email" }),
})

export function NewsletterFooter() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof footerFormSchema>>({
        resolver: zodResolver(footerFormSchema),
        defaultValues: {
            name: "",
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof footerFormSchema>) {
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    name: values.name,
                    pdf_choice: "all",
                    source: "footer",
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setIsSubmitted(true)
                form.reset()

                // Track analytics
                Analytics.trackFormSubmit("footer", values.email)
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
        <footer className="bg-[#050505] border-t border-[#C5A059]/20 pt-20 pb-10">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Newsletter Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C5A059]/10 mb-4">
                            <Mail className="h-6 w-6 text-[#C5A059]" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-white font-playfair">Stay Updated</h3>
                        <p className="text-gray-400 mb-6">
                            Join 1,000+ entrepreneurs getting weekly AI insights
                        </p>

                        {isSubmitted ? (
                            <div className="bg-[#C5A059]/10 border border-[#C5A059] rounded-lg p-4 max-w-md mx-auto">
                                <p className="text-[#C5A059] font-medium">
                                    ✅ Check your email to confirm your subscription!
                                </p>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="max-w-md mx-auto space-y-3"
                                >
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Your name"
                                                            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your email"
                                                            type="email"
                                                            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="h-12 w-full px-6 bg-[#D80000] hover:bg-[#b30000] text-white"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Subscribing..." : (
                                            <>
                                                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </div>

                    {/* Footer Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5 text-center md:text-left">
                        <div>
                            <h4 className="font-bold mb-3 text-[#C5A059] uppercase tracking-wider text-sm">About</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Helping entrepreneurs master AI to automate and scale their businesses.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-3 text-[#C5A059] uppercase tracking-wider text-sm">Quick Links</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <Link href="/#email-form" className="hover:text-[#D80000] transition-colors">
                                        Get Free Playbooks
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/preferences" className="hover:text-[#D80000] transition-colors">
                                        Email Preferences
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-3 text-[#C5A059] uppercase tracking-wider text-sm">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>
                                    <a href="/privacy" className="hover:text-[#D80000] transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="/terms" className="hover:text-[#D80000] transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center text-sm text-gray-500 mt-12 pt-8 border-t border-white/5">
                        <p>&copy; {new Date().getFullYear()} AI Mastery for Entrepreneurs. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}