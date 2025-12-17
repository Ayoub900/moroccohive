import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign } from "lucide-react"

interface CircuitCardProps {
    id: string
    slug: string
    name: string
    tagline?: string
    description: string
    duration: number
    price: number
    images: string[]
    highlights: string[]
    category: string
    featured?: boolean
}

export function CircuitCard({
    slug,
    name,
    tagline,
    description,
    duration,
    price,
    images,
    highlights,
    category,
}: CircuitCardProps) {
    const mainImage = images[0] || "/placeholder-circuit.jpg"

    return (
        <div className="group relative overflow-hidden rounded-xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-300">
            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    src={mainImage}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {category}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-2xl font-bold text-foreground mb-2 font-serif">{name}</h3>
                {tagline && <p className="text-sm text-muted-foreground mb-3 italic">{tagline}</p>}

                <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>

                {/* Highlights Preview */}
                {highlights.length > 0 && (
                    <ul className="mb-4 space-y-1">
                        {highlights.slice(0, 3).map((highlight, index) => (
                            <li key={index} className="text-sm text-foreground flex items-start">
                                <span className="text-primary mr-2">✓</span>
                                <span className="line-clamp-1">{highlight}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Duration & Price */}
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
                    <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">{duration} Days</span>
                    </div>
                    <div className="flex items-center text-primary font-bold text-lg">
                        <DollarSign className="w-5 h-5" />
                        <span>{price}</span>
                    </div>
                </div>

                {/* CTA Button */}
                <Link href={`/circuits/${slug}`} className="block">
                    <Button className="w-full group-hover:bg-accent group-hover:border-accent transition-colors">
                        Explore This Journey
                    </Button>
                </Link>
            </div>
        </div>
    )
}
