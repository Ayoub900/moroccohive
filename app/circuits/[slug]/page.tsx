"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Clock, MapPin, Check, X, ArrowLeft, Info, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Circuit {
    id: string
    slug: string
    name: string
    tagline?: string
    description: string
    duration: number
    price: number
    images: string[]
    highlights: string[]
    included: string[]
    excluded: string[]
    optional: string[]
    itineraryGlance: string[]
    itineraryDetail: string
    mapUrl?: string
    category: string
}

export default function CircuitDetailPage() {
    const params = useParams()
    const [circuit, setCircuit] = useState<Circuit | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Booking Form State
    const [booking, setBooking] = useState({
        travelDates: "",
        numberOfTravelers: 2,
        fullName: "",
        email: "",
        phone: "",
        extraDetails: "",
    })
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (params.slug) {
            fetchCircuit(params.slug as string)
        }
    }, [params.slug])

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
                    arrivalCity: "N/A", // Not needed for specific circuit booking
                    departureCity: "N/A",
                    accommodation: "Standard",
                    budget: "N/A",
                    adventureActivities: [],
                    desiredExperiences: `Booking for circuit: ${circuit?.name} (${circuit?.slug})`,
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
                        <h1 className="text-2xl font-semibold text-foreground mb-2">Circuit Not Found</h1>
                        <p className="text-muted-foreground mb-6">{error || "The requested circuit could not be found."}</p>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-8">
                            <Link href="/circuits">Back to Circuits</Link>
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
                                <ArrowLeft className="h-4 w-4 mr-2" /> All Circuits
                            </Link>
                            <div className="space-y-3 animate-fade-in-up">
                                <span className="inline-block px-4 py-1.5 rounded-md bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs font-semibold uppercase tracking-wider">
                                    {circuit.category}
                                </span>
                                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                                    {circuit.name}
                                </h1>
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
                            {circuit.itineraryGlance.length > 0 && (
                                <div className="bg-card rounded-lg p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <h2 className="text-2xl font-semibold text-foreground mb-8">Itinerary</h2>
                                    <div className="space-y-0 relative">
                                        {/* Timeline line */}
                                        <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-border" />

                                        {circuit.itineraryGlance.map((day, index) => (
                                            <div key={index} className="relative pl-12 pb-8 last:pb-0 group">
                                                {/* Dot */}
                                                <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-card border-4 border-border flex items-center justify-center z-10 group-hover:border-accent/10 transition-colors">
                                                    <div className="w-3 h-3 rounded-full bg-accent/70" />
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Day {index + 1}</span>
                                                    <h3 className="text-lg font-medium text-foreground">{day}</h3>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {circuit.itineraryDetail && (
                                        <div className="mt-10 pt-8 border-t border-border">
                                            <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Program</h3>
                                            <div className="prose prose-gray prose-p:text-muted-foreground prose-p:font-light max-w-none">
                                                <p className="whitespace-pre-line leading-relaxed">{circuit.itineraryDetail}</p>
                                            </div>
                                        </div>
                                    )}
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
                        </div>

                        {/* Sidebar - Floating Soft Card */}
                        <div className="lg:col-span-4">
                            <div className="space-y-6">
                                {/* Price Card */}
                                <div className="bg-card rounded-lg p-8 shadow-[0_20px_40px_rgb(0,0,0,0.06)] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                                    <div className="relative z-10 mb-8">
                                        <div className="text-center">
                                            <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Total Price</span>
                                            <div className="flex items-baseline justify-center gap-1 mt-2">
                                                <span className="text-5xl font-bold text-foreground tracking-tight">${circuit.price}</span>
                                                <span className="text-muted-foreground font-medium">/ person</span>
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
                                                <Label htmlFor="travelDates" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Travel Dates</Label>
                                                <Input
                                                    id="travelDates"
                                                    placeholder="Preferred dates"
                                                    value={booking.travelDates}
                                                    onChange={(e) => setBooking({ ...booking, travelDates: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="travelers" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Travelers</Label>
                                                <Input
                                                    id="travelers"
                                                    type="number"
                                                    min="1"
                                                    value={booking.numberOfTravelers}
                                                    onChange={(e) => setBooking({ ...booking, numberOfTravelers: parseInt(e.target.value) })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fullname" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Full Name</Label>
                                                <Input
                                                    id="fullname"
                                                    placeholder="John Doe"
                                                    value={booking.fullName}
                                                    onChange={(e) => setBooking({ ...booking, fullName: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Phone</Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="+212 600..."
                                                    value={booking.phone}
                                                    onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={booking.email}
                                                    onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                                                    required
                                                    className="bg-gray-50 border-gray-100 rounded-md focus:ring-orange-200 h-11"
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={submitting}
                                                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-md h-11 text-base font-medium shadow-lg shadow-gray-900/10 mt-4"
                                            >
                                                {submitting ? "Sending Request..." : "Request Booking"}
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
