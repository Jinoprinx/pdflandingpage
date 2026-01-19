"use client"

import { useState, useEffect } from "react"
import { useSessionStorage } from "react-use"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

const emailSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    name: z.string().min(2, { message: "Please enter your name" }),
})

export function ExitIntentPopup() {
    const [shown, setShown] = useSessionStorage("exit-popup-shown", false)
    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
            name: "",
        },
    })

    useEffect(() => {
        if (shown) return

        const handleMouseLeave = (e: MouseEvent) => {
            // Check if mouse is leaving through the top of the viewport
            if (e.clientY <= 10 && !shown) {
                setIsOpen(true)
                setShown(true)
            }
        }

        document.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            document.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [shown, setShown])

    async function onSubmit(values: z.infer<typeof emailSchema>) {
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...values,
                    pdf_choice: "all",
                    source: "exit_popup",
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
                        source: "exit_popup",
                        subscriber_email: values.email,
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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed left-1/2 top-[25%] -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
                    >
                        <Card className="border-2 border-[#C5A059]/30 shadow-[0_20px_60px_rgba(197,160,89,0.3)] rounded-3xl">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100 transition-colors z-10"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </button>

                            <CardHeader className="text-center pb-4 pt-8">
                                <div className="text-5xl mb-4">⏳</div>
                                <CardTitle className="text-3xl font-playfair text-[#1A1A1A]">Wait! Don't Miss Out!</CardTitle>
                                <CardDescription className="text-base mt-3 text-gray-600 leading-relaxed">
                                    Get instant access to our <strong className="text-[#C5A059]">3 Free AI Playbooks</strong> used by 1,000+ entrepreneurs
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center space-y-3 py-4"
                                    >
                                        <div className="text-5xl">✅</div>
                                        <h3 className="text-xl font-bold font-playfair text-[#1A1A1A]">Check Your Email!</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            We've sent you a confirmation link. Click it to get your free playbooks.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder="Your name" className="h-12 border-gray-200 focus:border-[#C5A059] transition-colors" {...field} />
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
                                                        <FormControl>
                                                            <Input placeholder="Your email" type="email" className="h-12 border-gray-200 focus:border-[#C5A059] transition-colors" {...field} />
                                                        </FormControl>
                                                        <FormMessage className="text-[#D80000]" />
                                                    </FormItem>
                                                )}
                                            />

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full relative inline-flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 group ring-1 ring-[#D80000] text-base font-semibold text-white tracking-tight bg-[#D80000] rounded-full pt-4 pr-8 pb-4 pl-8 shadow-[0_10px_30px_rgba(216,0,0,0.3)] hover:shadow-[0_10px_40px_rgba(216,0,0,0.4)] hover:scale-105"
                                            >
                                                <span className="relative z-[1]">{isSubmitting ? "Subscribing..." : "Get Free Playbooks Now →"}</span>
                                            </button>

                                            <p className="text-xs text-center text-gray-500">
                                                No spam. Unsubscribe anytime.
                                            </p>
                                        </form>
                                    </Form>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
