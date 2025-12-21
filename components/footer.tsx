import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo_1.PNG"
                                alt="MoroccoHive Logo"
                                width={180}
                                height={180}
                                className="h-24 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Discover the magic of Morocco with expertly curated tours and unforgettable experiences.
                        </p>
                        <div className="flex space-x-4 align-center">
                            <Link href="https://www.tripadvisor.fr/Profile/moroccohive" target="_blank" className="text-muted-foreground ">
                                <span className="sr-only">TripAdvisor</span>
                                <Image src="/link1.svg" alt="TripAdvisor" width={24} height={24} />
                            </Link>
                            <Link href="https://www.instagram.com/moroccohive/" target="_blank" className="text-muted-foreground ">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://wa.me/212634717423" target="_blank" className="text-muted-foreground ">
                                <span className="sr-only">Whatsapp</span>
                                <MessageCircle className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/circuits" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Our Trips
                                </Link>
                            </li>
                            <li>
                                <Link href="/plan-trip" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    Plan Your Trip
                                </Link>
                            </li>
                            <li>
                                <Link href="/#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Popular Destinations */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Popular Destinations
                        </h3>
                        <ul className="space-y-2">
                            <li className="text-sm text-muted-foreground">Marrakech</li>
                            <li className="text-sm text-muted-foreground">Fes</li>
                            <li className="text-sm text-muted-foreground">Sahara Desert</li>
                            <li className="text-sm text-muted-foreground">Chefchaouen</li>
                            <li className="text-sm text-muted-foreground">Casablanca</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                            Contact Us
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-primary" />
                                <span>Marrakech, Morocco</span>
                            </li>
                            <li className="flex items-center text-sm text-muted-foreground">
                                <Phone className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
                                <a href="tel:+212634717423" className="hover:text-primary transition-colors">
                                    +212 634717423
                                </a>
                            </li>
                            <li className="flex items-center text-sm text-muted-foreground">
                                <Mail className="w-4 h-4 mr-2 flex-shrink-0 text-primary" />
                                <a href="mailto:info@moroccohive.com" className="hover:text-primary transition-colors">
                                    info@moroccohive.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex justify-center items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-muted-foreground">
                            © {currentYear} MoroccoHive. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
