"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
import { MapPin, ArrowRight, Star, Shield, Heart, Clock, Mail, Phone, Send, Check, MousePointerClick, Settings2, CalendarCheck, Map, ChevronDown, Plane, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CountryCodeSelect } from "@/components/ui/country-code-select"
import { FavoriteButton } from "@/components/favorite-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const LOCAL_AGENTS = [
  {
    name: "Elhoussain",
    role: "Dedicated Tour Guide",
    image: "/agent-1.jpeg",
    description: "Hello dear travelers, Hello, my name is Elhoussain Iggui, and I have been a dedicated tour guide in Morocco since 1995, bringing over three decades of expertise to travelers seeking authentic adventures. Specializing in hiking tours, I expertly navigate the diverse landscapes of the Atlas Mountains, Rif ranges, and Sahara dunes, offering immersive experiences that blend cultural insights, scenic trails, and personalized itineraries. With a passion for Morocco's natural beauty and heritage, I ensure safe, memorable journeys for hikers of all levels, from casual treks to challenging expeditions, while sharing stories of local traditions and hidden gems along the way."
  },
  {
    name: "Abdellatif",
    role: "Professional Driver & Tour Guide",
    image: "/agent-2.jpeg",
    description: "Hello, my name is Abdellatif Iggui, and I have been a dedicated driver & tour guide in Morocco for over 7 years, specializing in organized trips across the entire country. With expertise as a professional driver, I lead immersive road trips that showcase Morocco's diverse landscapes, from the bustling cities of Casablanca and Marrakech to the serene Atlas Mountains and Sahara deserts. Having guided more than 210 tours with tourists from around the world, I ensure safe, seamless journeys filled with cultural insights, hidden gems, and personalized itineraries tailored to every adventurer's pace and interests."
  }
]

const TESTIMONIALS = [
  {
    name: "Martin Schreiber",
    location: "Canada",
    date: "Dec 08, 2024",
    text: "Our driver, Abdellatif Iggui, was absolutely outstanding in every way. He was first of all an excellent, safe driver, who knew every inch of the country and of every city. He was always on time, and always knew just how long any of our journeys would take. He made sure we were comfortable throughout, he was happy to stop for pictures or a rest as needed, he was able to share a lot of information about his country, and overall made the journeys very pleasant.",
    stars: 5
  },
  {
    name: "Brid and Brett",
    location: "USA",
    date: "Nov 2024",
    text: "Hamza We are back in the USA after having a wonderful full trip in Africa. Thank you for all of your work for our Morroco portion of our trip. We had a great time in your country and thouroughly enjoyed all of our time there. Each of our tours was so well done and informative. We particularly loved Chefchouen, the desert and camels and Marrakech. Abdelatif was a great driver and very informative giving us wonderful nsights into the country and people. Thank you again for giving us such wonderful memories.",
    stars: 5
  },
  {
    name: "Pamelia Bain",
    location: "USA",
    date: "Oct 22, 2024",
    text: "\"From the moment I got off the plane in Casablanca where I first met Abdellatif, I felt completely assured that I was in good hands, especially knowing he would be with me the entire trip. He is truly a professional in his skill and knowledge and he demonstrated that every step of the way. Abdellatif was always on time and kept me informed as we navigated the many kilometers we traveled daily. His enthusiasm, knowledge and love of his country shone through each day. He had a big responsibility for those 13 days with so many long hours. But he readily shared so much about the rich history and the lives of the people. I do not think I could have had a more immersive experience with anyone else.\"",
    stars: 5
  },
  {
    name: "Natalie Foster",
    location: "USA",
    date: "Sep 3, 2025",
    text: "Morocco We'll Be Back! I want to thank Travel Local and the staff that made my Moroccan vacation a beautiful experience for both me and my sister. It was our first time traveling to Morocco. Our driver and guide Abdellatif was very kind and welcoming. He made every day fun and interesting. He even went so far as to teach us some Arabic words (shukran). The Sahara Desert camp site in Merzouga was one of the best highlights of our tour. Watching the sunrise the next morning in the desert was awesome.",
    stars: 5
  },
  {
    name: "Ines Fonzalida",
    location: "Netherlands",
    date: "Sep 23",
    text: "I recently returned from leading a Mambo group tour through Morocco with your company. Throughout the tour, Abdellatif was far more than just a driver, he was an incredible support, a source of knowledge, and a true ambassador for Morocco. His warm personality, cultural insights, and exceptional people skills had a huge impact on the group's overall experience. It felt as though we had a dedicated local guide alongside us the entire time.",
    stars: 5
  },
  {
    name: "Claramarie C.",
    location: "San Jose, CA",
    date: "Aug 14, 2025",
    text: "Our trip was spectacular! Hakim was responsive in the planning process and adjusted the items I wanted changed quickly and accurately. The Riads we stayed in were gorgeous across the board. The real star of our vacation was our diver/guide/ honorary family member Abdellatif Iggui. From the moment he met us at the airport until he dropped us at the port eight days later he was a delight. Abdellatif was knowledgeable, friendly, accommodating and fun.",
    stars: 5
  }
]

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`bg-background rounded-xl border transition-all duration-300 ${isOpen ? 'border-primary shadow-md' : 'border-border/50 shadow-sm hover:shadow-md'
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 md:p-8 flex items-start justify-between gap-4 group"
      >
        <div className="flex items-start gap-4">
          <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
            }`}>
            ?
          </span>
          <h3 className="text-lg font-bold text-foreground pt-1">{question}</h3>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 mt-1 ${isOpen ? 'rotate-180 text-primary' : ''
            }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="p-6 md:p-8 pt-0 md:pt-0 ml-12 text-muted-foreground font-light leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

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

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverImage: string | null
  createdAt: string
  tags: string[]
}

export default function HomePage() {
  const [circuits, setCircuits] = useState<Circuit[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [blogsLoading, setBlogsLoading] = useState(true)

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+212",
    subject: "",
    message: ""
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    fetchFeaturedCircuits()
    fetchLatestBlogs()
  }, [])

  const fetchLatestBlogs = async () => {
    try {
      const response = await fetch("/api/blog?limit=3")
      const data = await response.json()
      if (data.data) {
        setBlogPosts(data.data)
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setBlogsLoading(false)
    }
  }

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
        body: JSON.stringify({
          ...contactForm,
          phone: `${contactForm.countryCode} ${contactForm.phone}`
        }),
      })

      if (response.ok) {
        setSent(true)
        setContactForm({ name: "", email: "", phone: "", countryCode: "+212", subject: "", message: "" })
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
              Discover the Kingdom <br />
              of Morocco:
            </h1>

            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed max-w-2xl mx-auto mb-10">
              A land where timeless beauty, vibrant culture, and unforgettable adventures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white/90 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href="/plan-trip">Start Planning</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent hover:bg-white/10 text-white/90 border-white/20 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href="/circuits">Explore Trips</Link>
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
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Morocco Tours & Itineraries</h2>
                <p className="text-muted-foreground mt-2 font-light">Get inspired by trips other travelers have loved</p>
              </div>
              <Link href="/circuits" className="flex items-center text-accent hover:text-accent/90 font-medium group text-sm">
                View All Trips <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
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
                        <div className="absolute top-4 right-4 z-10">
                          <FavoriteButton circuitId={circuit.id} />
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

        {/* How it Works - Interactive Steps */}
        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className="text-accent font-medium tracking-widest text-xs uppercase">Your Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">How it Works</h2>
              <p className="text-muted-foreground font-light">From first inspiration to unforgettable memories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-px border-t border-dashed border-border -translate-y-1/2 z-0" />

              {[
                {
                  step: "01",
                  title: "Choose Your Style",
                  desc: "Select from our curated itineraries or tell us your travel preferences.",
                  icon: MousePointerClick
                },
                {
                  step: "02",
                  title: "Customize & Refine",
                  desc: "Work with our local experts to tailor every detail to your liking.",
                  icon: Settings2
                },
                {
                  step: "03",
                  title: "Secure Booking",
                  desc: "Finalize your journey with flexible payments and full support.",
                  icon: CalendarCheck
                },
                {
                  step: "04",
                  title: "Explore Morocco",
                  desc: "Embark on an authentic journey guided by local insiders.",
                  icon: Map
                }
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 bg-background border border-border/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="text-4xl font-bold text-primary/20 transition-colors">{item.step}</span>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white/90 px-8 h-12 text-base rounded-md font-medium transition-all">
                <Link href="/plan-trip">Start Planning</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Enhanced Grid */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-accent font-medium tracking-widest text-xs uppercase">The Difference</span>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mt-4">
                  Why Travel with <br />
                  Morocco Hive?
                </h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed mt-6">
                  We don&apos;t just sell tours; we build relationships. Our commitment to authenticity and quality ensures every trip is a masterpiece of Moroccan hospitality.
                </p>

                <div className="mt-10 space-y-6">
                  {[
                    {
                      title: "100% Local Expertise",
                      desc: "Our team lives and breathes Morocco, providing insights you won't find anywhere else."
                    },
                    {
                      title: "Tailored to You",
                      desc: "No cookie-cutter tours. Every itinerary is adjusted to your pace and interests."
                    },
                    {
                      title: "Fair & Transparent",
                      desc: "We prioritize fair wages for our guides and transparent pricing for our guests."
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mt-1">
                        <Check className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{benefit.title}</h4>
                        <p className="text-muted-foreground text-sm font-light mt-1">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">Safe & Secure</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">Top-rated safety protocols and secure payments.</p>
                  </div>
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm translate-y-8">
                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary">
                      <Star className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">Premium Quality</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">Hand-picked luxury riads and expert local guides.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm -translate-y-8">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-accent">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">24/7 Support</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">Real-time assistance from our team during your trip.</p>
                  </div>
                  <div className="bg-card p-8 rounded-3xl border border-border/50 text-center hover:border-primary/30 transition-colors shadow-sm">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-600">
                      <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">Local Impact</h3>
                    <p className="text-muted-foreground text-xs font-light mt-2 leading-relaxed">Supporting local communities and sustainable travel.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Local Agents */}
        <section className="py-24 bg-background overflow-hidden border-b border-border">
          <div className="max-w-7xl justify-center mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative gap-4 p-4">
                <div className="flex flex-col items-center gap-8 pt-4">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Our Local Agents in Morocco</h2>

                  {/* Agent Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
                    {LOCAL_AGENTS.map((agent, i) => (
                      <div key={i} className="group relative bg-card rounded-2xl border border-border/50 p-6 transition-all hover:border-primary/30 hover:shadow-xl hover:-translate-y-1">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/10 shadow-inner">
                            <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">{agent.name}</h3>
                            <p className="text-xs text-primary font-semibold uppercase tracking-widest">{agent.role}</p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="rounded-full border-primary/20 text-primary hover:bg-primary/5 px-6">
                                Read More
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <div className="flex items-center gap-5 mb-6">
                                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg">
                                    <Image src={agent.image} alt={agent.name} fill className="object-cover" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-2xl font-bold tracking-tight">{agent.name}</DialogTitle>
                                    <DialogDescription className="text-primary font-semibold tracking-wide uppercase text-xs mt-1">{agent.role}</DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>
                              <div className="text-muted-foreground leading-relaxed text-base font-light whitespace-pre-wrap italic bg-accent/5 p-8 rounded-2xl border border-accent/10">
                                "{agent.description}"
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {[
                    { label: "Native expertise", icon: Check },
                    { label: "Multilingual support", icon: Check },
                    { label: "Community driven", icon: Check },
                    { label: "24/7 Availability", icon: Check },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                        <item.icon className="w-3 h-3 text-secondary" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div> */}


              </div>
              <div className="space-y-8">
                <span className="text-accent font-medium tracking-widest text-xs uppercase">The Heart of Morocco</span>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                  Guided by the People Who Know It Best
                </h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground text-lg font-light leading-relaxed">
                    Our local agents are more than just guides; they are storytellers, historians, and friends. Born and raised in the regions they lead, they provide an insider's perspective that you won't find in any guidebook.
                  </p>

                </div>

              </div>

            </div>

            <div className="flex justify-center mt-12">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-md h-12 px-8 shadow-lg shadow-primary/10">
                <Link href="/plan-trip">Plan with an Expert</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <span className="text-accent font-medium tracking-widest text-xs uppercase">Help & Advice</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
              <p className="text-muted-foreground font-light">Everything you need to know about your Moroccan journey</p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "When is the best time to visit Morocco?",
                  a: "Spring (March to May) and fall (September to mid-November) are the ideal seasons to travel to Morocco. In contrast to the bitter cold and snow of winter or the intense heat of summer, the weather is pleasant but warm. If you enjoy the warmer weather, summer is also a great time to visit. You can travel to the coastal areas."
                },
                {
                  q: "Is Morocco a safe country?",
                  a: "Yes, Morocco is generally considered a safe country for tourists, with low levels of violent crime and no significant gun violence, though petty crimes like pickpocketing and scams are common in tourist areas. Official advisories recommend exercising increased caution due to a potential terrorism threat, but this applies to many destinations globally. As of 2025, there are no major conflicts affecting visitors, and millions travel there annually without issues—stick to common-sense precautions like not walking alone at night in isolated areas."
                },
                {
                  q: "Do I need to purchase travel insurance?",
                  a: "Yes, before taking part in any of our tours, all travelers using MoroccoHive must have travel insurance. On the first day of your trip, your guide will gather your travel insurance information. It is your duty to ensure that you have appropriate and sufficient travel insurance."
                },
                {
                  q: "Do I need to tip?",
                  a: "Tipping service staff is common in Morocco – typically around 15% for a restaurant meal. It is also standard to round up the fare or the bill for taxi drivers and porters (around 20 MAD). Your tour guide and crew would be especially appreciative and honored with this kind of traditional gratitude at the end of your tour."
                }
              ].map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Blog Posts */}
        <section className="py-24 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Travel Insights</h2>
                <p className="text-muted-foreground mt-2 font-light">Stories, tips, and inspiration from Morocco</p>
              </div>
              <Link href="/blog" className="text-accent hover:text-accent/90 font-medium text-sm flex items-center group">
                Read All Posts <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogsLoading ? (
                // Skeleton loading state
                [1, 2, 3].map((i) => (
                  <div key={i} className="bg-background rounded-xl h-[400px] animate-pulse border border-border/50" />
                ))
              ) : blogPosts.length > 0 ? (
                blogPosts.map((post) => (
                  <div key={post.id} className="group bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-border/50 flex flex-col h-full">
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      {post.coverImage ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <Plane className="w-12 h-12 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 font-light mb-4 flex-1">
                        {post.excerpt || (post as any).content?.substring(0, 100).replace(/<[^>]*>/g, '') + "..."}
                      </p>
                      <Link href={`/blog/${post.slug}`} className="text-primary font-medium text-sm flex items-center group/link mt-auto">
                        Read More <ArrowRight className="ml-1 w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  <p>No blog posts found at the moment. Stay tuned!</p>
                </div>
              )}
            </div>
          </div>
        </section >

        {/* Testimonials */}
        <section className="py-24 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className="text-secondary font-medium tracking-widest text-xs uppercase">Guest Stories</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Travelers Say</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl flex flex-col items-center text-center group">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <div className="grow flex flex-col">
                    <p className="text-lg font-light leading-relaxed mb-6 italic text-white/90 line-clamp-4">
                      "{testimonial.text}"
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-secondary text-sm font-medium hover:underline mb-8 self-center">Read More</button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <div className="flex gap-1 mb-2">
                            {[...Array(testimonial.stars)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                            ))}
                          </div>
                          <DialogTitle className="text-2xl">{testimonial.name}</DialogTitle>
                          <DialogDescription>Reviewed on {testimonial.date} • {testimonial.location}</DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-wrap italic">
                          "{testimonial.text}"
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div>
                    <p className="font-bold text-secondary uppercase tracking-wider text-sm">{testimonial.name}</p>
                    <p className="text-white/50 text-xs mt-1">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section >

        {/* Contact Section - Clean & Soft */}
        < section id="contact" className="py-24 bg-background/50" >
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
                      <p className="text-muted-foreground font-light mt-1">moroccohive@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mt-1 mr-4">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Call Us</h4>
                      <p className="text-muted-foreground font-light mt-1">+212 634717423</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-card shadow-sm flex items-center justify-center text-primary mt-1 mr-4">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Visit Us</h4>
                      <p className="text-muted-foreground font-light mt-1">Morocco Hive, Marrakech, Morocco</p>
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
                      <Label htmlFor="name" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Name</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        placeholder=""
                        className="bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        placeholder=""
                        className="bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs uppercase text-gray-500 font-semibold tracking-wider">Phone Number</Label>
                      <div className="flex gap-2">
                        <CountryCodeSelect
                          value={contactForm.countryCode}
                          onChange={(val) => setContactForm({ ...contactForm, countryCode: val })}
                        />
                        <Input
                          id="phone"
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          required
                          placeholder=""
                          className="flex-1 bg-background border-input h-11 rounded-md focus:ring-ring focus:border-ring"
                        />
                      </div>
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
        </section >
      </main >

      <Footer />
    </div >
  )
}
