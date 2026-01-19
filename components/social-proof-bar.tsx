"use client"

import { useState, useEffect } from "react"
import { Users, TrendingUp, Star } from "lucide-react"
import { motion } from "framer-motion"

export function SocialProofBar() {
    const [subscriberCount, setSubscriberCount] = useState(0)
    const [displayCount, setDisplayCount] = useState(1000) // Default fallback

    useEffect(() => {
        fetch("/api/subscriber-count")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setSubscriberCount(data.count)
                    setDisplayCount(data.displayCount || data.count)
                }
            })
            .catch((error) => console.error("Failed to fetch subscriber count:", error))
    }, [])

    const stats = [
        {
            icon: Users,
            value: `${displayCount.toLocaleString()}+`,
            label: "Active Subscribers",
        },
        {
            icon: TrendingUp,
            value: "95%",
            label: "Success Rate",
        },
        {
            icon: Star,
            value: "4.9/5",
            label: "Average Rating",
        },
    ]

    return (
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-6 md:p-8 mb-8">
            <div className="max-w-4xl mx-auto">
                <p className="text-center text-sm font-medium text-primary mb-4">
                    TRUSTED BY ENTREPRENEURS WORLDWIDE
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                                <stat.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Testimonials Section */}
                <div className="mt-8 pt-8 border-t border-primary/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-background rounded-lg p-4">
                            <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-sm mb-3 italic">
                                "These playbooks transformed how I approach AI in my business. Highly recommend!"
                            </p>
                            <p className="text-xs font-medium">- Sarah K., E-commerce Founder</p>
                        </div>

                        <div className="bg-background rounded-lg p-4">
                            <div className="flex gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                ))}
                            </div>
                            <p className="text-sm mb-3 italic">
                                "Actionable insights that I could implement immediately. Game changer!"
                            </p>
                            <p className="text-xs font-medium">- Mike T., SaaS Entrepreneur</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
