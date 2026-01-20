"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Settings, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const preferencesSchema = z.object({
    topic_business_automation: z.boolean(),
    topic_ai_trends: z.boolean(),
    topic_ai_education: z.boolean(),
    frequency: z.enum(["daily", "weekly", "monthly"]),
})

import { Suspense } from "react"
// ... imports

function PreferencesPageContent() {
    const searchParams = useSearchParams()
    // ... rest of the component logic (lines 26-309 of original function)
    const token = searchParams.get("token")

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [subscriber, setSubscriber] = useState<{ email: string; name: string } | null>(null)

    const form = useForm<z.infer<typeof preferencesSchema>>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            topic_business_automation: true,
            topic_ai_trends: true,
            topic_ai_education: true,
            frequency: "weekly",
        },
    })

    useEffect(() => {
        if (!token) {
            setError("No token provided. Please use the link from your email.")
            setLoading(false)
            return
        }

        async function loadPreferences() {
            try {
                const response = await fetch(`/api/preferences?token=${token}`)
                const data = await response.json()

                if (response.ok) {
                    setSubscriber(data.subscriber)
                    form.reset(data.preferences)
                } else {
                    setError(data.error || "Failed to load preferences")
                }
            } catch {
                setError("Something went wrong. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        loadPreferences()
    }, [token, form])

    async function onSubmit(values: z.infer<typeof preferencesSchema>) {
        setSaving(true)
        setSuccess(false)

        try {
            const response = await fetch("/api/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    ...values,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                setTimeout(() => setSuccess(false), 3000)
            } else {
                alert(data.error || "Failed to update preferences")
            }
        } catch {
            alert("Something went wrong. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    async function handleUnsubscribe() {
        if (!confirm("Are you sure you want to unsubscribe from all emails?")) {
            return
        }

        setSaving(true)

        try {
            const response = await fetch("/api/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    unsubscribe: true,
                }),
            })

            const data = await response.json()

            if (response.ok) {
                alert(data.message)
                window.location.href = "/"
            } else {
                alert(data.error || "Failed to unsubscribe")
            }
        } catch {
            alert("Something went wrong. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/">← Go to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                <Card className="border-2">
                    <CardHeader className="text-center">
                        <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                        <CardTitle className="text-3xl">Email Preferences</CardTitle>
                        <CardDescription className="text-base">
                            Manage what emails you receive from us
                            {subscriber && (
                                <span className="block mt-2 font-medium">
                                    {subscriber.name} ({subscriber.email})
                                </span>
                            )}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Topic Preferences */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">What topics interest you?</h3>

                                    <FormField
                                        control={form.control}
                                        name="topic_business_automation"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">Business Automation</FormLabel>
                                                    <FormDescription>
                                                        Learn how to automate workflows and save time
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="topic_ai_trends"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">AI Trends & Insights</FormLabel>
                                                    <FormDescription>
                                                        Stay updated on the latest AI developments
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="topic_ai_education"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">AI Education</FormLabel>
                                                    <FormDescription>
                                                        Tutorials and guides for mastering AI tools
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Frequency */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">How often do you want to hear from us?</h3>
                                    <FormField
                                        control={form.control}
                                        name="frequency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select frequency" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="daily">Daily Digest</SelectItem>
                                                        <SelectItem value="weekly">Weekly Newsletter</SelectItem>
                                                        <SelectItem value="monthly">Monthly Summary</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    We&apos;ll send you emails based on this schedule
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button type="submit" size="lg" className="flex-1" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : success ? (
                                            <>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Saved!
                                            </>
                                        ) : (
                                            "Save Preferences"
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        size="lg"
                                        variant="outline"
                                        onClick={handleUnsubscribe}
                                        disabled={saving}
                                    >
                                        Unsubscribe
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Button variant="link" asChild>
                        <Link href="/">← Back to Home</Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

export default function PreferencesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <PreferencesPageContent />
        </Suspense>
    )
}
