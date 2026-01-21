import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import Link from "next/link"

interface LeadMagnetCardProps {
    title: string
    description: string
    imageUrl?: string
    downloadUrl?: string
    ctaText?: string
    pages?: number
    format?: string
}

export function LeadMagnetCard({
    title,
    description,
    imageUrl, // In a real app we'd use Image component, but for now we might use an icon fallback
    downloadUrl = "#email-form",
    ctaText = "Get It Free",
    pages = 25,
    format = "PDF"
}: LeadMagnetCardProps) {
    return (
        <Card className="flex flex-col h-full border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
            <CardHeader>
                <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center relative overflow-hidden group">
                    {/* Placeholder for actual image or icon */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20" />
                    <FileText className="h-16 w-16 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                    {imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    )}
                </div>
                <CardTitle className="text-xl font-bold font-playfair">{title}</CardTitle>
                <CardDescription className="line-clamp-2">{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center"><FileText className="mr-1 h-3 w-3" /> {pages} Pages</span>
                    <span className="flex items-center"><span className="mr-1 font-bold">Format:</span> {format}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full bg-[#D80000] hover:bg-[#B30000] text-white">
                    <Link href={downloadUrl}>
                        <Download className="mr-2 h-4 w-4" /> {ctaText}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
