"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle2, XCircle, Loader2, Download, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Suspense } from "react"
// ... imports

function ConfirmPageContent() {
    const searchParams = useSearchParams()
    // ... rest of the component logic
    return (
        // ... component JSX
    )
}

export default function ConfirmPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <ConfirmPageContent />
        </Suspense>
    )
}
