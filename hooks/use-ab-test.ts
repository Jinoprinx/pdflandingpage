"use client"

import { useState, useEffect } from "react"

// Simple random bucket assignment
// In a real app, this might persist to cookies or local storage
// so the user sees the same variant on reload.

export function useAbTest(testName: string, variants: string[] = ["control", "variant_a"]) {
    const [variant, setVariant] = useState<string>("")

    useEffect(() => {
        // Check local storage first
        const storageKey = `ab_test_${testName}`
        const storedVariant = localStorage.getItem(storageKey)

        if (storedVariant && variants.includes(storedVariant)) {
            setVariant(storedVariant)
        } else {
            // Assign new variant
            const randomIndex = Math.floor(Math.random() * variants.length)
            const newVariant = variants[randomIndex]
            localStorage.setItem(storageKey, newVariant)
            setVariant(newVariant)
        }
    }, [testName, variants])

    return variant
}
