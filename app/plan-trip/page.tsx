"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
    Check,
    ChevronRight,
    ChevronLeft,
    Users,
    Calendar,
    MapPin,
    Home,
    DollarSign,
    Heart,
    Mail,
    Phone,
    User,
    Sparkles,
    Mountain,
    Plane
} from "lucide-react"

const STEPS = [
    { id: 1, name: "Travel Style", icon: Users },
    { id: 2, name: "When & Where", icon: MapPin },
    { id: 3, name: "Preferences", icon: Heart },
    { id: 4, name: "Contact", icon: Mail },
]

export default function PlanTripPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        travelStyle: "",
        travelDates: "",
        arrivalCity: "",
        departureCity: "",
        accommodation: "",
        budget: "",
        adventureActivities: [] as string[],
        desiredExperiences: "",
        transportation: "",
        importantCriteria: "",
        numberOfTravelers: 1,
        travelerAges: "",
        extraDetails: "",
        fullName: "",
        email: "",
        phone: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const activities = [
        { name: "Camel Trekking", icon: "🐪" },
        { name: "Hiking", icon: "🥾" },
        { name: "Surfing", icon: "🏄" },
        { name: "Quad Biking", icon: "🏍️" },
        { name: "Sandboarding", icon: "🏂" },
        { name: "Hot Air Balloon", icon: "🎈" },
        { name: "Cooking Class", icon: "👨‍🍳" },
        { name: "Photography Tour", icon: "📸" },
    ]

    const handleActivityToggle = (activity: string) => {
        setFormData(prev => ({
            ...prev,
            adventureActivities: prev.adventureActivities.includes(activity)
                ? prev.adventureActivities.filter(a => a !== activity)
                : [...prev.adventureActivities, activity]
        }))
    }

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {}

        if (step === 1) {
            if (!formData.travelStyle) newErrors.travelStyle = "Please select your travel style"
            if (!formData.numberOfTravelers || formData.numberOfTravelers < 1) {
                newErrors.numberOfTravelers = "Please enter number of travelers"
            }
        } else if (step === 2) {
            if (!formData.travelDates) newErrors.travelDates = "Please provide your travel dates"
            if (!formData.arrivalCity) newErrors.arrivalCity = "Please select arrival city"
            if (!formData.departureCity) newErrors.departureCity = "Please select departure city"
        } else if (step === 3) {
            if (!formData.accommodation) newErrors.accommodation = "Please select accommodation"
            if (!formData.budget) newErrors.budget = "Please select budget"
            if (!formData.desiredExperiences.trim()) {
                newErrors.desiredExperiences = "Please describe your desired experiences"
            }
        } else if (step === 4) {
            if (!formData.fullName.trim()) newErrors.fullName = "Please enter your name"
            if (!formData.email.trim()) newErrors.email = "Please enter your email"
            if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = "Please enter a valid email"
            }
            if (!formData.phone.trim()) newErrors.phone = "Please enter your phone"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
        }
    }

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const handleSubmit = async () => {
        if (!validateStep(4)) return

        setSubmitting(true)
        try {
            const response = await fetch("/api/trip-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to submit")
            }

            setSubmitted(true)
        } catch (error) {
            alert(error instanceof Error ? error.message : "Failed to submit request")
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="max-w-2xl mx-auto px-4 text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <Check className="w-12 h-12 text-primary" />
                        </div>
                        <h1 className="text-4xl font-bold font-serif mb-4">Thank You!</h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            We've received your trip request and will get back to you within 24 hours with a personalized itinerary.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button asChild>
                                <a href="/">
                                    <Home className="mr-2 h-4 w-4" />
                                    Back to Home
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="/circuits">
                                    <Plane className="mr-2 h-4 w-4" />
                                    Browse Circuits
                                </a>
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
                            Plan Your Dream Trip
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Tell us about your preferences and we'll craft a perfect itinerary
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between">
                            {STEPS.map((step, index) => {
                                const Icon = step.icon
                                const isActive = currentStep === step.id
                                const isCompleted = currentStep > step.id

                                return (
                                    <div key={step.id} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center relative flex-1">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center border-1 transition-all ${isCompleted
                                                    ? "bg-primary border-primary text-primary-foreground"
                                                    : isActive
                                                        ? "bg-primary/10 border-primary text-primary"
                                                        : "bg-muted border-border text-muted-foreground"
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <Check className="w-6 h-6" />
                                                ) : (
                                                    <Icon className="w-6 h-6" />
                                                )}
                                            </div>
                                            <p
                                                className={`mt-2 text-sm text-nowrap font-medium ${isActive ? "text-foreground" : "text-muted-foreground"
                                                    }`}
                                            >
                                                {step.name}
                                            </p>
                                        </div>
                                        {/* {index < STEPS.length - 1 && (
                                            <div
                                                className={`h-0.5 flex-1 mx-2 ${isCompleted ? "bg-primary" : "bg-border"
                                                    }`}
                                            />
                                        )} */}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                        {/* Step 1: Travel Style */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center mb-6">
                                    <Users className="w-12 h-12 text-primary mx-auto mb-3" />
                                    <h2 className="text-2xl font-bold mb-2">Who's Traveling?</h2>
                                    <p className="text-muted-foreground">Help us understand your group</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3">Travel Style</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {["Solo", "Couple", "Family", "Group"].map((style) => (
                                            <button
                                                key={style}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, travelStyle: style.toLowerCase() }))}
                                                className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${formData.travelStyle === style.toLowerCase()
                                                    ? "border-primary bg-primary/10 text-primary font-semibold shadow-lg"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                <div className="text-2xl mb-2">
                                                    {style === "Solo" && "🧳"}
                                                    {style === "Couple" && "💑"}
                                                    {style === "Family" && "👨‍👩‍👧‍👦"}
                                                    {style === "Group" && "👥"}
                                                </div>
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.travelStyle && <p className="text-sm text-destructive mt-2">{errors.travelStyle}</p>}
                                </div>

                                <div>
                                    <label htmlFor="numberOfTravelers" className="block text-sm font-semibold mb-2">
                                        Number of Travelers
                                    </label>
                                    <input
                                        type="number"
                                        id="numberOfTravelers"
                                        min="1"
                                        value={formData.numberOfTravelers}
                                        onChange={(e) => setFormData(prev => ({ ...prev, numberOfTravelers: parseInt(e.target.value) || 1 }))}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                    />
                                    {errors.numberOfTravelers && <p className="text-sm text-destructive mt-2">{errors.numberOfTravelers}</p>}
                                </div>

                                <div>
                                    <label htmlFor="travelerAges" className="block text-sm font-semibold mb-2">
                                        Ages of Travelers (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="travelerAges"
                                        value={formData.travelerAges}
                                        onChange={(e) => setFormData(prev => ({ ...prev, travelerAges: e.target.value }))}
                                        placeholder="e.g., 25, 28, 5, 8"
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: When & Where */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center mb-6">
                                    <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                                    <h2 className="text-2xl font-bold mb-2">When & Where?</h2>
                                    <p className="text-muted-foreground">Plan your journey through Morocco</p>
                                </div>

                                <div>
                                    <label htmlFor="travelDates" className="block text-sm font-semibold mb-2">
                                        <Calendar className="inline w-4 h-4 mr-1" />
                                        Travel Dates
                                    </label>
                                    <input
                                        type="text"
                                        id="travelDates"
                                        value={formData.travelDates}
                                        onChange={(e) => setFormData(prev => ({ ...prev, travelDates: e.target.value }))}
                                        placeholder="e.g., March 15-25, 2025 or Flexible"
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                    />
                                    {errors.travelDates && <p className="text-sm text-destructive mt-2">{errors.travelDates}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="arrivalCity" className="block text-sm font-semibold mb-2">
                                            <Plane className="inline w-4 h-4 mr-1" />
                                            Arrival City
                                        </label>
                                        <select
                                            id="arrivalCity"
                                            value={formData.arrivalCity}
                                            onChange={(e) => setFormData(prev => ({ ...prev, arrivalCity: e.target.value }))}
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        >
                                            <option value="">Select city</option>
                                            <option value="Marrakech">🏵️ Marrakech</option>
                                            <option value="Casablanca">🌊 Casablanca</option>
                                            <option value="Fes">🕌 Fes</option>
                                            <option value="Tangier">⚓ Tangier</option>
                                            <option value="Agadir">🏖️ Agadir</option>
                                        </select>
                                        {errors.arrivalCity && <p className="text-sm text-destructive mt-2">{errors.arrivalCity}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="departureCity" className="block text-sm font-semibold mb-2">
                                            <Plane className="inline w-4 h-4 mr-1 transform rotate-45" />
                                            Departure City
                                        </label>
                                        <select
                                            id="departureCity"
                                            value={formData.departureCity}
                                            onChange={(e) => setFormData(prev => ({ ...prev, departureCity: e.target.value }))}
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        >
                                            <option value="">Select city</option>
                                            <option value="Marrakech">🏵️ Marrakech</option>
                                            <option value="Casablanca">🌊 Casablanca</option>
                                            <option value="Fes">🕌 Fes</option>
                                            <option value="Tangier">⚓ Tangier</option>
                                            <option value="Agadir">🏖️ Agadir</option>
                                        </select>
                                        {errors.departureCity && <p className="text-sm text-destructive mt-2">{errors.departureCity}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Preferences */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center mb-6">
                                    <Heart className="w-12 h-12 text-primary mx-auto mb-3" />
                                    <h2 className="text-2xl font-bold mb-2">Your Preferences</h2>
                                    <p className="text-muted-foreground">Customize your perfect experience</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3">
                                        <Home className="inline w-4 h-4 mr-1" />
                                        Accommodation
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { name: "Budget", icon: "🏕️" },
                                            { name: "Standard", icon: "🏨" },
                                            { name: "Luxury", icon: "👑" },
                                            { name: "Mixed", icon: "🎭" }
                                        ].map((level) => (
                                            <button
                                                key={level.name}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, accommodation: level.name.toLowerCase() }))}
                                                className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${formData.accommodation === level.name.toLowerCase()
                                                    ? "border-primary bg-primary/10 text-primary font-semibold"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                <div className="text-2xl mb-1">{level.icon}</div>
                                                {level.name}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.accommodation && <p className="text-sm text-destructive mt-2">{errors.accommodation}</p>}
                                </div>

                                <div>
                                    <label htmlFor="budget" className="block text-sm font-semibold mb-2">
                                        <DollarSign className="inline w-4 h-4 mr-1" />
                                        Budget Range (per person)
                                    </label>
                                    <select
                                        id="budget"
                                        value={formData.budget}
                                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                    >
                                        <option value="">Select budget</option>
                                        <option value="$500-$1000">$500 - $1,000</option>
                                        <option value="$1000-$2000">$1,000 - $2,000</option>
                                        <option value="$2000-$3500">$2,000 - $3,500</option>
                                        <option value="$3500+">$3,500+</option>
                                    </select>
                                    {errors.budget && <p className="text-sm text-destructive mt-2">{errors.budget}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-3">
                                        <Mountain className="inline w-4 h-4 mr-1" />
                                        Adventure Activities (Optional)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {activities.map((activity) => (
                                            <button
                                                key={activity.name}
                                                type="button"
                                                onClick={() => handleActivityToggle(activity.name)}
                                                className={`p-3 text-sm rounded-lg border-2 transition-all hover:scale-105 ${formData.adventureActivities.includes(activity.name)
                                                    ? "border-primary bg-primary/10 text-primary font-semibold"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                <span className="block text-lg mb-1">{activity.icon}</span>
                                                {activity.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="desiredExperiences" className="block text-sm font-semibold mb-2">
                                        <Sparkles className="inline w-4 h-4 mr-1" />
                                        What experiences are you looking for?
                                    </label>
                                    <textarea
                                        id="desiredExperiences"
                                        value={formData.desiredExperiences}
                                        onChange={(e) => setFormData(prev => ({ ...prev, desiredExperiences: e.target.value }))}
                                        rows={4}
                                        placeholder="Tell us about your interests, must-see places, and what makes this trip special..."
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
                                    />
                                    {errors.desiredExperiences && <p className="text-sm text-destructive mt-2">{errors.desiredExperiences}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Contact */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="text-center mb-6">
                                    <Mail className="w-12 h-12 text-primary mx-auto mb-3" />
                                    <h2 className="text-2xl font-bold mb-2">Almost Done!</h2>
                                    <p className="text-muted-foreground">How can we reach you?</p>
                                </div>

                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
                                        <User className="inline w-4 h-4 mr-1" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                    />
                                    {errors.fullName && <p className="text-sm text-destructive mt-2">{errors.fullName}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                            <Mail className="inline w-4 h-4 mr-1" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        />
                                        {errors.email && <p className="text-sm text-destructive mt-2">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                                            <Phone className="inline w-4 h-4 mr-1" />
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="+1 234 567 8900"
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        />
                                        {errors.phone && <p className="text-sm text-destructive mt-2">{errors.phone}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="extraDetails" className="block text-sm font-semibold mb-2">
                                        Additional Details (Optional)
                                    </label>
                                    <textarea
                                        id="extraDetails"
                                        value={formData.extraDetails}
                                        onChange={(e) => setFormData(prev => ({ ...prev, extraDetails: e.target.value }))}
                                        rows={3}
                                        placeholder="Dietary restrictions, accessibility needs, special occasions, etc."
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-border">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </Button>

                            {currentStep < STEPS.length ? (
                                <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex items-center gap-2"
                                >
                                    {submitting ? "Submitting..." : "Submit Request"}
                                    <Sparkles className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    )
}
