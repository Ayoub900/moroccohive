"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
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
    Plane,
    Heart as HeartIcon,
    Star,
    BedSingle,
    Bed,
    Tv,
} from "lucide-react"
import Image from "next/image"

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
        experiences: [] as string[],
        importantFactors: [] as string[],
        desiredExperiences: "",
        transportation: "",
        importantCriteria: "",
        numberOfTravelers: 1,
        travelerAges: "",
        extraDetails: "",
        fullName: "",
        email: "",
        phone: "",
        countryCode: "+212",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const experiencesList = [
        {
            name: "History & culture",
            image: "https://images.unsplash.com/photo-1539020290231-93dae737380f?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Nature & landscapes",
            image: "https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Wildlife & safari",
            image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Relaxation & wellness",
            image: "https://images.unsplash.com/photo-1540555708036-688330af487c?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Active & adventure",
            image: "https://images.unsplash.com/photo-1533580905137-d662cb24fa21?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Luxury travel",
            image: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?q=80&w=400&h=300&fit=crop"
        }
    ]

    const importantFactorsList = [
        {
            name: "Historical Sites, Museums & Monuments",
            description: "Immerse yourself in the hustle and bustle of Morocco's cities as you explore labyrinthine backstreets, architecture dating back centuries, and souks brimming with spices, wool rugs, and more.",
            image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Nature & Outdoors",
            description: "From the snowcapped Atlas mountains to the undulating dunes of the Sahara desert and out to the vast coastline, discover Morocco's natural wonders on hikes, nature tours, and other outdoor excursions.",
            image: "https://images.unsplash.com/photo-1489493585363-d694362c3f91?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Active Vacation",
            description: "Morocco offers limitless options for adventure, including mountain hikes through Berber villages, camel rides in the desert, sandboarding down the Sahara dunes, galloping on horseback along the beach, and more.",
            image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Local Cuisine",
            description: "Experience the highlights of Moroccan cuisine, from cooking classes and market visits to wine tastings in beautiful vineyards and enjoying a home-cooked tajine in the company of locals.",
            image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Experience Culture & Local Life",
            description: "Immerse yourself in local life by exploring small villages, getting lost in quirky souqs, and sipping on chai nana (mint tea) on a café patio while enjoying the culture around you.",
            image: "https://images.unsplash.com/photo-1553505965-42a42095f6ea?q=80&w=400&h=300&fit=crop"
        }
    ]

    const activities = [
        {
            name: "Long Hikes (4 hrs-Full Day)",
            description: "Get the blood pumping on scenic day hikes like the summit trek up Mount Toubkal or the High Atlas trail.",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Multi-Day Trekking",
            description: "Pack your overnight gear and head out on multi-day treks throughout Morocco from High Atlas to Sahara.",
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Horseback Riding",
            description: "Experience the beauty of Morocco on horseback as you gallop through the surf near Essaouira.",
            image: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Surfing",
            description: "Explore Morocco's long coastline, a prime surf destination for beginners and experienced wave riders.",
            image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "ATV",
            description: "Hop on an ATV and zip around the gorges of the High Atlas mountains or the arid hills of Agafay Desert.",
            image: "https://images.unsplash.com/photo-1531323385161-0ae796843452?q=80&w=400&h=300&fit=crop"
        },
        {
            name: "Hot Air Balloon",
            description: "Experience breathtaking views of the Atlas Mountains and local landscapes from a hot air balloon.",
            image: "https://images.unsplash.com/photo-1520110120287-63e26637b3de?q=80&w=400&h=300&fit=crop"
        }
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
            // desiredExperiences is now optional
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
                body: JSON.stringify({
                    ...formData,
                    phone: `${formData.countryCode} ${formData.phone}`
                }),
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
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">
                            Plan Your Dream Trip
                        </h1>
                        <div className="max-w-2xl mx-auto bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                                    <Image
                                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200&h=200"
                                        alt="Abdellatif"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                        Let&apos;s together create a dream Morocco tour
                                        <Sparkles className="w-5 h-5 text-primary opacity-50" />
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm italic">
                                        &quot;Hello, I&apos;m Abdellatif, TravelLocal&apos;s personal contact! I&apos;ll walk you through the form to construct your ideal tour over the course of the next three minutes. After you&apos;re done, a local expert will respond to you with a first customized travel suggestion in no more than 48 hours (and often quicker).&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
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
                                                <div className="flex justify-center mb-3">
                                                    {style === "Solo" && <User className="w-8 h-8 text-primary/60" />}
                                                    {style === "Couple" && <Heart className="w-8 h-8 text-primary/60" />}
                                                    {style === "Family" && <Users className="w-8 h-8 text-primary/60" />}
                                                    {style === "Group" && <Users className="w-8 h-8 text-primary/60" />}
                                                </div>
                                                <span className="text-sm font-semibold tracking-wide uppercase">{style}</span>
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
                                    <label className="block text-sm font-semibold mb-4">
                                        <Calendar className="inline w-4 h-4 mr-1 text-primary" />
                                        Travel Window
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Earliest Start Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.travelDates.split(" to ")[0] || ""}
                                                onChange={(e) => {
                                                    const end = formData.travelDates.split(" to ")[1] || ""
                                                    setFormData({ ...formData, travelDates: `${e.target.value}${end ? ` to ${end}` : ""}` })
                                                }}
                                                className="bg-background h-11 border-border focus:ring-primary/20"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Latest End Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.travelDates.split(" to ")[1] || ""}
                                                onChange={(e) => {
                                                    const start = formData.travelDates.split(" to ")[0] || ""
                                                    setFormData({ ...formData, travelDates: `${start ? `${start} to ` : ""}${e.target.value}` })
                                                }}
                                                className="bg-background h-11 border-border focus:ring-primary/20"
                                            />
                                        </div>
                                    </div>
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
                                            <option value="Marrakech">Marrakech</option>
                                            <option value="Casablanca">Casablanca</option>
                                            <option value="Fes">Fes</option>
                                            <option value="Tangier">Tangier</option>
                                            <option value="Agadir">Agadir</option>
                                            <option value="Ouarzazate">Ouarzazate</option>
                                            <option value="Essaouira">Essaouira</option>
                                            <option value="Rabat">Rabat</option>
                                            <option value="Other">Other</option>
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
                                            <option value="Marrakech">Marrakech</option>
                                            <option value="Casablanca">Casablanca</option>
                                            <option value="Fes">Fes</option>
                                            <option value="Tangier">Tangier</option>
                                            <option value="Agadir">Agadir</option>
                                            <option value="Ouarzazate">Ouarzazate</option>
                                            <option value="Essaouira">Essaouira</option>
                                            <option value="Rabat">Rabat</option>
                                            <option value="Other">Other</option>
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
                                    <label className="block text-sm font-semibold mb-6 text-center">
                                        What is your preferred accommodation type?
                                    </label>
                                    <div className="flex flex-wrap justify-center gap-12">
                                        {[
                                            {
                                                name: "Standard",
                                                stars: 3,
                                                icon: (props: any) => (
                                                    <div className="relative flex items-end justify-center">
                                                        <Image src="/furniture-bedroom-single-bed.svg" alt="bed" width={40} height={40} {...props} />
                                                    </div>
                                                )
                                            },
                                            {
                                                name: "Comfort",
                                                stars: 4,
                                                icon: (props: any) => (
                                                    <div className="relative flex items-end justify-center">
                                                        <Image src="/double-bed-bedroom-pillow.svg" alt="bed" width={40} height={40} {...props} />
                                                    </div>
                                                )
                                            },
                                            {
                                                name: "Luxury",
                                                stars: 5,
                                                icon: (props: any) => (
                                                    <div className="relative flex items-end justify-center gap-1">
                                                        <Image src="/double-bed-bedroom-pillow.svg" alt="bed" width={38} height={38} />
                                                        <Image src="/workplace-interior-creative-space.svg" alt="television" width={24} height={24} />
                                                    </div>
                                                )
                                            }
                                        ].map((level) => (
                                            <button
                                                key={level.name}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, accommodation: level.name.toLowerCase() }))}
                                                className="flex flex-col items-center group"
                                            >
                                                <div className={`w-32 h-32 rounded-full border border-border/50 flex flex-col items-center justify-center transition-all duration-300 ${formData.accommodation === level.name.toLowerCase()
                                                    ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)] scale-110"
                                                    : "bg-card group-hover:border-primary/30 group-hover:bg-primary/[0.02]"
                                                    }`}>
                                                    <div className="flex mb-3">
                                                        {Array.from({ length: level.stars }).map((_, i) => (
                                                            <Star key={i} className={`w-2.5 h-2.5 fill-primary text-primary ${i > 0 ? "ml-0.5" : ""}`} />
                                                        ))}
                                                    </div>
                                                    <level.icon className={`w-10 h-10 transition-colors duration-300 ${formData.accommodation === level.name.toLowerCase() ? "text-primary" : "text-muted-foreground/40"}`} />
                                                </div>
                                                <span className={`mt-5 font-bold tracking-widest text-xs uppercase transition-all duration-300 ${formData.accommodation === level.name.toLowerCase() ? "text-primary scale-110" : "text-muted-foreground/70"}`}>
                                                    {level.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.accommodation && <p className="text-sm text-center text-destructive mt-6">{errors.accommodation}</p>}
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
                                    <label className="block text-sm font-semibold mb-4">
                                        Adventure Activities (Optional)
                                    </label>
                                    <div className="space-y-4">
                                        {activities.map((activity) => (
                                            <div
                                                key={activity.name}
                                                onClick={() => handleActivityToggle(activity.name)}
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-accent/5 ${formData.adventureActivities.includes(activity.name)
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border"
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-6 shrink-0 transition-colors ${formData.adventureActivities.includes(activity.name)
                                                    ? "bg-primary border-primary"
                                                    : "border-muted-foreground/30"
                                                    }`}>
                                                    {formData.adventureActivities.includes(activity.name) && (
                                                        <Check className="w-4 h-4 text-white" />
                                                    )}
                                                </div>
                                                <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 mr-6">
                                                    <Image
                                                        src={activity.image}
                                                        alt={activity.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg mb-1">{activity.name}</h4>
                                                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                                        {activity.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-6 text-center">
                                        What experiences are you looking for in Morocco? (Optional)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                        {experiencesList.map((exp) => (
                                            <button
                                                key={exp.name}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        experiences: prev.experiences.includes(exp.name)
                                                            ? prev.experiences.filter(e => e !== exp.name)
                                                            : [...prev.experiences, exp.name]
                                                    }))
                                                }}
                                                className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${formData.experiences.includes(exp.name)
                                                    ? "border-primary shadow-lg scale-[1.02]"
                                                    : "border-transparent hover:border-primary/40"
                                                    }`}
                                            >
                                                <Image src={exp.image} alt={exp.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className={`absolute inset-0 bg-black/40 transition-opacity ${formData.experiences.includes(exp.name) ? "opacity-20" : "group-hover:opacity-30"}`} />
                                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                    <span className="text-white text-xs md:text-sm font-bold block">{exp.name}</span>
                                                </div>
                                                <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border border-white/50 flex items-center justify-center transition-all ${formData.experiences.includes(exp.name) ? "bg-primary border-primary scale-110" : "bg-black/20"
                                                    }`}>
                                                    {formData.experiences.includes(exp.name) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-6 text-center">
                                        Which of the following are important for this trip to Morocco? (Optional)
                                    </label>
                                    <div className="space-y-4 mb-8">
                                        {importantFactorsList.map((factor) => (
                                            <div
                                                key={factor.name}
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        importantFactors: prev.importantFactors.includes(factor.name)
                                                            ? prev.importantFactors.filter(f => f !== factor.name)
                                                            : [...prev.importantFactors, factor.name]
                                                    }))
                                                }}
                                                className={`flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-accent/5 ${formData.importantFactors.includes(factor.name)
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border"
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-4 shrink-0 transition-colors ${formData.importantFactors.includes(factor.name)
                                                    ? "bg-primary border-primary"
                                                    : "border-muted-foreground/30"
                                                    }`}>
                                                    {formData.importantFactors.includes(factor.name) && (
                                                        <Check className="w-3 h-3 text-white" />
                                                    )}
                                                </div>
                                                <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 mr-4">
                                                    <Image src={factor.image} alt={factor.name} fill className="object-cover" />
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-bold text-sm mb-1">{factor.name}</h4>
                                                    <p className="text-[10px] text-muted-foreground font-light leading-relaxed line-clamp-2">
                                                        {factor.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="desiredExperiences" className="block text-sm font-semibold mb-2">
                                        <Sparkles className="inline w-4 h-4 mr-1 text-primary" />
                                        Additional information (optional)
                                    </label>
                                    <textarea
                                        id="desiredExperiences"
                                        value={formData.desiredExperiences}
                                        onChange={(e) => setFormData(prev => ({ ...prev, desiredExperiences: e.target.value }))}
                                        rows={4}
                                        placeholder="e.g. wine tasting, local market tours, hiking, river cruises, cooking classes"
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
                                        className="w-full px-4 h-11 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
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
                                            className="w-full px-4 h-11 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                        />
                                        {errors.email && <p className="text-sm text-destructive mt-2">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                                            <Phone className="inline w-4 h-4 mr-1" />
                                            Phone
                                        </label>
                                        <div className="flex gap-2">
                                            <CountryCodeSelect
                                                value={formData.countryCode}
                                                onChange={(val) => setFormData(prev => ({ ...prev, countryCode: val }))}
                                            />
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                                placeholder="612345678"
                                                className="flex-1 px-4 h-11 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                                            />
                                        </div>
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
