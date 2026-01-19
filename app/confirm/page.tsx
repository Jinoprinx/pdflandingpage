"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle2, XCircle, Loader2, Download, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ConfirmPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")
    const [alreadyConfirmed, setAlreadyConfirmed] = useState(false)

    useEffect(() => {
        if (!token) {
            setStatus("error")
            setMessage("No confirmation token provided")
            return
        }

        async function confirmEmail() {
            try {
                const response = await fetch(`/api/confirm?token=${token}`)
                const data = await response.json()

                if (response.ok) {
                    setStatus("success")
                    setMessage(data.message)
                    setAlreadyConfirmed(data.alreadyConfirmed || false)
                } else {
                    setStatus("error")
                    setMessage(data.error || "Confirmation failed")
                }
            } catch {
                setStatus("error")
                setMessage("Something went wrong. Please try again.")
            }
        }

        confirmEmail()
    }, [token])

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-2">
                    <CardHeader className="text-center pb-6">
                        {status === "loading" && (
                            <>
                                <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto mb-4" />
                                <CardTitle className="text-2xl">Confirming Your Email...</CardTitle>
                                <CardDescription>Please wait while we verify your subscription</CardDescription>
                            </>
                        )}

                        {status === "success" && (
                            <>
                                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <CardTitle className="text-3xl">
                                    {alreadyConfirmed ? "Already Confirmed!" : "Email Confirmed! 🎉"}
                                </CardTitle>
                                <CardDescription className="text-lg mt-2">{message}</CardDescription>
                            </>
                        )}

                        {status === "error" && (
                            <>
                                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                                <CardTitle className="text-2xl">Oops! Something Went Wrong</CardTitle>
                                <CardDescription className="text-base mt-2">{message}</CardDescription>
                            </>
                        )}
                    </CardHeader>

                    {status === "success" && (
                        <CardContent className="space-y-6">
                            <div className="bg-primary/10 rounded-lg p-6 text-center">
                                <h3 className="font-bold text-lg mb-2">What&apos;s Next?</h3>
                                <p className="text-muted-foreground mb-4">
                                    We&apos;ve sent your free AI playbooks to your email inbox!
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button size="lg" className="gap-2">
                                        <Download className="h-5 w-5" />
                                        Open Email to Download
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href="/">
                                            Back to Home <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="text-3xl mb-2">📧</div>
                                    <p className="text-sm font-medium">Check Your Inbox</p>
                                    <p className="text-xs text-muted-foreground">Your playbooks are waiting</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="text-3xl mb-2">📚</div>
                                    <p className="text-sm font-medium">Start Learning</p>
                                    <p className="text-xs text-muted-foreground">Implement AI strategies</p>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="text-3xl mb-2">🚀</div>
                                    <p className="text-sm font-medium">Grow Your Business</p>
                                    <p className="text-xs text-muted-foreground">Automate and scale</p>
                                </div>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                <p>
                                    You&apos;ll receive weekly AI insights. Update your preferences{" "}
                                    <Link href="/preferences" className="text-primary underline">
                                        here
                                    </Link>
                                    .
                                </p>
                            </div>
                        </CardContent>
                    )}

                    {status === "error" && (
                        <CardContent className="text-center">
                            <Button size="lg" asChild>
                                <Link href="/">Go Back to Home</Link>
                            </Button>
                        </CardContent>
                    )}
                </Card>
            </motion.div>
        </div>
    )
}
