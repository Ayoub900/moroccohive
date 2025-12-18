"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { MapPin, ArrowRight, Star, Shield, Heart, Clock, Mail, Phone, Send, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Circuit {
  id: string
  slug: string
  name: string
  description: string
  duration: number
  price: number
  images: string[]
  category: string
}

export default function HomePage() {
  const [circuits, setCircuits] = useState<Circuit[]>([])
  const [loading, setLoading] = useState(true)

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    fetchFeaturedCircuits()
  }, [])

  const fetchFeaturedCircuits = async () => {
    try {
      const response = await fetch("/api/circuits?featured=true")
      if (response.ok) {
        const data = await response.json()
        setCircuits(data.slice(0, 3))
      }
    } catch (error) {
      console.error("Failed to fetch circuits:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      })

      if (response.ok) {
        setSent(true)
        setContactForm({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setSent(false), 5000)
      } else {
        console.log(response.status)
        if (response.status === 429) alert("Too many requests. Please try again later.")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background/50 flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        {/* Simplified Hero Section */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-bg.png"
              alt="Morocco Sahara"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              Where Every Path <br />
              Tells a Story
            </h1>

            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto mb-10">
              Bespoke Moroccan journeys designed to connect you with the soul of the country.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white/90 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href="/plan-trip">Start Your Journey</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent hover:bg-white/10 text-white/90 border-white/20 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href="/circuits">Explore Circuits</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Philosophy / Intro - Clean & Minimal */}
        <section className="py-24 bg-card border-b border-border">
          <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
            <span className="text-accent font-medium tracking-widest text-xs uppercase">Our Philosophy</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Authentic & Unforgettable</h2>
            <p className="text-muted-foreground leading-relaxed font-light">
              We believe travel is about connection. Our carefully crafted itineraries don&apos;t just show you sights,
              they immerse you in the vibrant culture, rich history, and warm hospitality that makes Morocco unique.
            </p>
          </div>
        </section>

        {/* Featured Circuits - Floating Cards */}
        <section className="py-24 bg-background/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Featured Journeys</h2>
                <p className="text-muted-foreground mt-2 font-light">Popular experiences loved by travelers</p>
              </div>
              <Link href="/circuits" className="flex items-center text-accent hover:text-accent/90 font-medium group text-sm">
                View All Circuits <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce mr-1"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce mr-1 delay-75"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-150"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {circuits.map((circuit) => (
                  <Link key={circuit.id} href={`/circuits/${circuit.slug}`} className="group block h-full">
                    <div className="bg-card rounded-md overflow-hidden shadow-[0_2px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col transform hover:-translate-y-1">
                      <div className="relative aspect-[4/3] overflow-hidden bg-background">
                        {circuit.images[0] ? (
                          <Image
                            src={circuit.images[0]}
                            alt={circuit.name}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="inline-block px-3 py-1 rounded-md bg-accent/10 text-xs font-semibold text-accent tracking-wide shadow-sm">
                            {circuit.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                            <span>{circuit.duration} Days</span>
                            <span className="text-primary">From ${circuit.price}</span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                            {circuit.name}
                          </h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-6 font-light">
                          {circuit.description}
                        </p>
                        <div className="mt-auto flex items-center text-foreground font-medium text-sm group-hover:translate-x-2 transition-transform duration-300">
                          Explore <ArrowRight className="ml-2 h-4 w-4 text-primary" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Minimal Why Choose Us */}
        <section className="py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Expertly Curated</h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  Hand-picked accommodations and experiences vetted by our local experts.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Peace of Mind</h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  24/7 support throughout your journey and secure booking process.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">Local Impact</h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  We work directly with local guides and communities to support sustainable tourism.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Clean & Soft */}
        <section id="contact" className="py-24 bg-background/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="p-8 md:p-10">
                <span className="text-accent font-medium tracking-widest text-xs uppercase block mb-4">Get in Touch</span>
                <h2 className="text-4xl font-bold text-foreground mb-6 tracking-tight">Let&apos;s plan your dream trip</h2>
                <p className="text-muted-foreground mb-12 font-light leading-relaxed">
                  Have questions or ready to start planning? Send us a message and our travel experts will get right back to you.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mt-1 mr-4">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Email Us</h4>
                      <p className="text-muted-foreground font-light mt-1">info@moroccohive.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mt-1 mr-4">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Call Us</h4>
                      <p className="text-muted-foreground font-light mt-1">+212 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mt-1 mr-4">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Visit Us</h4>
                      <p className="text-muted-foreground font-light mt-1">123 Avenue Mohammed V, Marrakech</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form Card */}
              <div className="bg-card rounded-xl shadow-[0_20px_40px_rgb(0,0,0,0.06)] p-8 md:p-10 border border-border/50">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We will get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Your Name</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        placeholder="John Doe"
                        className="bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        placeholder="john@example.com"
                        className="bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        required
                        placeholder="Trip Inquiry..."
                        className="bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Message</Label>
                      <Textarea
                        id="message"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                        placeholder="Tell us about your dream trip..."
                        className="bg-background border-input min-h-[140px] rounded-md focus:ring-ring focus:border-ring resize-none p-4"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-md text-base font-medium shadow-lg mt-2"
                    >
                      {sending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
