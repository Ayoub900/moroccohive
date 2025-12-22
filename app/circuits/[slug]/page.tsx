"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Check, X, ArrowLeft, Info, Calendar, Plus, Heart } from "lucide-react"
import { FavoriteButton } from "@/components/favorite-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { Textarea } from "@/components/ui/textarea"
import { PriceBadge } from "@/components/ui/price-badge"

interface Circuit {
    id: string
    slug: string
    name: string
    tagline?: string
    description: string
    duration: number
    price: number
    isFrom?: boolean
    originalPrice?: number
    images: string[]
    highlights: string[]
    included: string[]
    excluded: string[]
    optional: string[]
    itineraryGlance: string[]
    itineraryDetail: string
    additionalInfo?: string
    mapUrl?: string
    category: string
}

export default function CircuitDetailPage() {
    const params = useParams()
    const [circuit, setCircuit] = useState<Circuit | null>(null)
    const [loading, setLoading] = useState(true)
    const [travelers, setTravelers] = useState({
        adults: 2,
        children: 0,
        infants: 0,
    })
    const [error, setError] = useState<string | null>(null)

    // Booking Form State
    const [booking, setBooking] = useState({
        travelDates: "",
        numberOfTravelers: 2,
        fullName: "",
        email: "",
        phone: "",
        countryCode: "+212",
        extraDetails: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (params.slug) {
            fetchCircuit(params.slug as string)
        }
    }, [params.slug])

    const handleTravelerChange = (type: "adults" | "children" | "infants", delta: number) => {
        setTravelers((prev) => {
            const newValue = Math.max(0, prev[type] + delta)
            // Ensure at least 1 adult
            if (type === "adults" && newValue < 1) return prev

            const newTravelers = { ...prev, [type]: newValue }
            const total = newTravelers.adults + newTravelers.children + newTravelers.infants

            // Build the travelerAges string
            const parts: string[] = []
            if (newTravelers.adults > 0) parts.push(`${newTravelers.adults} adult${newTravelers.adults !== 1 ? "s" : ""}`)
            if (newTravelers.children > 0)
                parts.push(`${newTravelers.children} child${newTravelers.children !== 1 ? "ren" : ""}`)
            if (newTravelers.infants > 0) parts.push(`${newTravelers.infants} infant${newTravelers.infants !== 1 ? "s" : ""}`)

            setBooking((prev) => ({
                ...prev,
                numberOfTravelers: total,
                travelerAges: parts.join(", "),
            }))

            return newTravelers
        })
    }

    const fetchCircuit = async (slug: string) => {
        try {
            const response = await fetch(`/api/circuits/${slug}`)
            if (!response.ok) {
                throw new Error("Circuit not found")
            }
            const data = await response.json()
            setCircuit(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load circuit")
        } finally {
            setLoading(false)
        }
    }

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch("/api/trip-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...booking,
                    travelStyle: "Custom Circuit",
                    arrivalCity: "N/A",
                    departureCity: "N/A",
                    accommodation: "Standard",
                    budget: "N/A",
                    adventureActivities: [],
                    desiredExperiences: `Booking for circuit: ${circuit?.name} (${circuit?.slug})`,
                    phone: `${booking.countryCode} ${booking.phone}`,
                }),
            })

            if (response.ok) {
                setSubmitted(true)
            } else {
                const data = await response.json()
                alert(data.error || "Failed to send booking request. Please try again.")
            }
        } catch (error) {
            console.error("Booking error:", error)
            alert("Failed to submit booking.")
        } finally {
            setSubmitting(false)
        }
    }

    const renderRichText = (text: string) => {
        if (!text) return ""
        return text
            .replace(/^### (.*?)$/gm, "<h3 class='text-lg font-bold mt-6 mb-4'>$1</h3>")
            .replace(/^## (.*?)$/gm, "<h2 class='text-xl font-bold mt-8 mb-4'>$1</h2>")
            .replace(/^# (.*?)$/gm, "<h1 class='text-2xl font-bold mt-10 mb-6'>$1</h1>")
            .replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-foreground'>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
            .replace(/__(.*?)__/g, "<u class='underline'>$1</u>")
            .replace(/~~(.*?)~~/g, "<s class='line-through'>$1</s>")
            .replace(/`(.*?)`/g, "<code class='bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono'>$1</code>")
            .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' class='text-primary underline hover:text-primary/80' target='_blank' rel='noopener noreferrer'>$1</a>")
            .replace(/^> (.*?)$/gm, "<blockquote class='border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4'>$1</blockquote>")
            .replace(/\n- /g, "<br />• ")
            .replace(/\n\d+\. /g, "<br />1. ")
            .replace(/\n/g, "<br />")
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background/50 flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
                        <p className="text-muted-foreground text-sm font-medium">Loading details...</p>
                    </div>
                </main>
            </div>
        )
    }

    if (error || !circuit) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-foreground mb-2">Trip Not Found</h1>
                        <p className="text-muted-foreground mb-6">{error || "The requested circuit could not be found."}</p>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8">
                            <Link href="/circuits">Back to Trips</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent selection:text-accent-foreground">
            <Header />

            <main className="flex-1">
                {/* Soft Hero with minimal overlay */}
                <section className="relative h-[65vh] w-full">
                    {circuit.images[0] ? (
                        <Image
                            src={circuit.images[0]}
                            alt={circuit.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    )}
                    {/* Softer gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <div className="max-w-7xl mx-auto">
                            <Link
                                href="/circuits"
                                className="inline-flex items-center text-white/95 hover:text-white mb-6 transition-colors text-sm font-medium bg-white/10 px-4 py-2 rounded-md border border-white/20 hover:bg-white/20"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" /> All Trips
                            </Link>
                            <div className="space-y-3 animate-fade-in-up">
                                <span className="inline-block px-4 py-1.5 rounded-md bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-semibold uppercase tracking-wider">
                                    {circuit.category}
                                </span>
                                <div className="flex items-start justify-between">
                                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                                        {circuit.name}
                                    </h1>
                                    <FavoriteButton circuitId={circuit.id} className="mt-2" />
                                </div>
                                {circuit.tagline && (
                                    <p className="text-xl text-white/90 max-w-2xl font-light leading-relaxed">
                                        {circuit.tagline}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Main Content - Minimal aesthetic (no borders, soft shadows) */}
                        <div className="lg:col-span-8 space-y-12">

                            {/* Overview */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <h2 className="text-2xl font-semibold text-foreground mb-6">The Experience</h2>
                                <p className="text-muted-foreground leading-loose text-lg font-light">
                                    {circuit.description}
                                </p>
                            </div>

                            {/* Highlights - Soft cards grid */}
                            {circuit.highlights.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Highlights</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {circuit.highlights.map((highlight, index) => (
                                            <div key={index} className="flex items-center p-4 bg-card rounded-lg shadow-[0_2px_8px_rgb(0,0,0,0.02)] border border-border/50">
                                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mr-4">
                                                    <Check className="w-4 h-4 text-accent" />
                                                </div>
                                                <span className="text-muted-foreground font-medium">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Itinerary - Minimal Timeline */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                {circuit.itineraryGlance.length > 0 && (
                                    <>
                                        <h2 className="text-2xl font-semibold text-foreground mb-8">Itinerary Overview</h2>
                                        <div className="space-y-0 relative">
                                            {/* Timeline line */}
                                            {/* <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-border" /> */}

                                            {circuit.itineraryGlance.map((day, index) => (
                                                <div key={index} className="relative pl-12 pb-8 last:pb-0 group">
                                                    {/* Dot */}
                                                    <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center z-10 group-hover:border-accent/10 transition-colors">
                                                        <div className="w-3 h-3 rounded-full bg-primary/40" />
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Day {index + 1}</span>
                                                        <h3 className="text-lg font-medium text-foreground">{day}</h3>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}


                                <div className="mt-10 pt-8 border-t border-border">

                                    {circuit.mapUrl && (
                                        <div className="reletive w-full">
                                            <Image src={circuit.mapUrl} alt="Map" width={400} height={400} className="object-contain rounded-lg mb-6" />
                                        </div>
                                    )}
                                    {circuit.itineraryDetail && (
                                        <>
                                            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                                <Info className="w-5 h-5 text-accent" />
                                                Detailed Itinerary
                                            </h3>
                                            <div
                                                className="prose prose-gray max-w-none text-muted-foreground leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: renderRichText(circuit.itineraryDetail) }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Additional Info */}
                            {circuit.additionalInfo && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Important Notes</h2>
                                    <div
                                        className="prose prose-gray max-w-none text-muted-foreground leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: renderRichText(circuit.additionalInfo) }}
                                    />
                                </div>
                            )}

                            {/* Inclusions - Soft Lists */}
                            <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-secondary" /> Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {circuit.included.map((item, index) => (
                                                <li key={index} className="flex items-start text-gray-600 text-sm font-medium">
                                                    <Check className="w-4 h-4 mr-3 mt-0.5 text-secondary flex-shrink-0" />
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-destructive/30" /> Not Included
                                        </h3>
                                        <ul className="space-y-4">
                                            {circuit.excluded.map((item, index) => (
                                                <li key={index} className="flex items-start text-gray-500 text-sm">
                                                    <X className="w-4 h-4 mr-3 mt-0.5 text-destructive flex-shrink-0" />
                                                    <span className="text-muted-foreground">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Optional Activities */}
                            {circuit.optional && circuit.optional.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-6">Optional Activities</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {circuit.optional.map((item, index) => (
                                            <div key={index} className="flex items-center p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                                                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mr-4">
                                                    <Plus className="w-4 h-4 text-secondary" />
                                                </div>
                                                <span className="text-foreground font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Floating Soft Card */}
                        <div className="lg:col-span-4">
                            <div className="space-y-6">
                                {/* Price Card */}
                                <div className="bg-card rounded-lg p-8 shadow-[0_20px_40px_rgb(0,0,0,0.06)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                                    <div className="relative z-10 mb-8">
                                        <div className="text-center">
                                            <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">From</span>
                                            <div className="flex items-baseline justify-center gap-1 mt-2">
                                                <div className="flex items-baseline gap-4">
                                                    <PriceBadge price={circuit.price} originalPrice={circuit.originalPrice} from={circuit.isFrom} />
                                                </div>
                                                {/* <span className="text-muted-foreground font-medium">/ person</span> */}
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-center justify-between p-4 bg-background rounded-lg">
                                            <span className="text-sm text-muted-foreground font-medium">Duration</span>
                                            <div className="flex items-center text-foreground font-semibold">
                                                <Clock className="w-4 h-4 mr-2 text-accent" />
                                                {circuit.duration} Days
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking Form Direct */}
                                    {submitted ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Check className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">Request Sent!</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Our team will get back to you shortly to confirm your booking for <strong>{circuit.name}</strong>.
                                            </p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleBookingSubmit} className="space-y-6">
                                            <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Book This Trip</h3>

                                            <div className="space-y-2">
                                                <Label htmlFor="travelDates" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Earliest Start Date</Label>
                                                <Input
                                                    id="travelDates"
                                                    type="date"
                                                    value={booking.travelDates.split(" to ")[0] || ""}
                                                    onChange={(e) => {
                                                        const end = booking.travelDates.split(" to ")[1] || ""
                                                        setBooking({ ...booking, travelDates: `${e.target.value}${end ? ` to ${end}` : ""}` })
                                                    }}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="travelDates2" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Latest End Date</Label>
                                                <Input
                                                    id="travelDates2"
                                                    type="date"
                                                    value={booking.travelDates.split(" to ")[1] || ""}
                                                    onChange={(e) => {
                                                        const start = booking.travelDates.split(" to ")[0] || ""
                                                        setBooking({ ...booking, travelDates: `${start ? `${start} to ` : ""}${e.target.value}` })
                                                    }}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold mb-3">Who will be traveling?</label>
                                                <div className="space-y-4 bg-muted/30 p-6 rounded-lg border border-border">
                                                    {/* Adults */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-semibold text-foreground">Adults</div>
                                                            <div className="text-sm text-muted-foreground">Above 12</div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTravelerChange("adults", -1)}
                                                                disabled={travelers.adults <= 1}
                                                                className="w-10 h-10 rounded-full border-2 border-border hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:bg-primary/10"
                                                            >
                                                                <span className="text-xl font-semibold">−</span>
                                                            </button>
                                                            <span className="text-lg font-semibold w-8 text-center">{travelers.adults}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTravelerChange("adults", 1)}
                                                                className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                            >
                                                                <span className="text-xl font-semibold">+</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Children */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-semibold text-foreground">Children</div>
                                                            <div className="text-sm text-muted-foreground">Ages 2-12</div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTravelerChange("children", -1)}
                                                                disabled={travelers.children <= 0}
                                                                className="w-10 h-10 rounded-full border-2 border-border hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:bg-primary/10"
                                                            >
                                                                <span className="text-xl font-semibold">−</span>
                                                            </button>
                                                            <span className="text-lg font-semibold w-8 text-center">{travelers.children}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTravelerChange("children", 1)}
                                                                className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                            >
                                                                <span className="text-xl font-semibold">+</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Infants */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-semibold text-foreground">Infants</div>
                                                            <div className="text-sm text-muted-foreground">Under 2</div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTravelerChange("infants", -1)}
                                                                disabled={travelers.infants <= 0}
                                                                className="w-10 h-10 rounded-full border-2 border-border hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:bg-primary/10"
                                                            >
                                                                <span className="text-xl font-semibold">−</span>
                                                            </button>
                                                            <span className="text-lg font-semibold w-8 text-center">{travelers.infants}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleTravelerChange("infants", 1)}
                                                                className="w-10 h-10 rounded-full border-2 border-border hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10"
                                                            >
                                                                <span className="text-xl font-semibold">+</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fullname" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Name</Label>
                                                <Input
                                                    id="fullname"
                                                    placeholder=""
                                                    value={booking.fullName}
                                                    onChange={(e) => setBooking({ ...booking, fullName: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Phone</Label>
                                                <div className="flex gap-2">
                                                    <CountryCodeSelect
                                                        value={booking.countryCode}
                                                        onChange={(val) => setBooking({ ...booking, countryCode: val })}
                                                    />
                                                    <Input
                                                        id="phone"
                                                        type="tel"
                                                        placeholder=""
                                                        value={booking.phone}
                                                        onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                                                        required
                                                        className="flex-1 bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder=""
                                                    value={booking.email}
                                                    onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-11 text-base font-medium shadow-lg shadow-gray-900/10 mt-4"
                                            >
                                                {submitting ? "Sending Request..." : "Request This Trip"}
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
