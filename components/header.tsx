"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navigation = [
        { name: "Home", href: "/" },
        { name: "Circuits", href: "/circuits" },
        { name: "Plan Your Trip", href: "/plan-trip" },
        { name: "About", href: "/#about" },
        { name: "Contact", href: "/#contact" },
    ]

    return (
        <header className="relative w-full border-b border-border/40 bg-background/95">
            {/* Top Bar */}
            <div className="hidden lg:block bg-primary/10 border-b border-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end items-center h-10 text-sm">
                        <div className="flex items-center space-x-6 text-muted-foreground">
                            <a href="tel:+212123456789" className="flex items-center hover:text-primary transition-colors">
                                <Phone className="w-3 h-3 mr-2" />
                                +212 123 456 789
                            </a>
                            <a href="mailto:info@moroccohive.com" className="flex items-center hover:text-primary transition-colors">
                                <Mail className="w-3 h-3 mr-2" />
                                info@moroccohive.com
                            </a>
                            <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-2" />
                                Morocco
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo_1.PNG"
                            alt="MoroccoHive Logo"
                            width={180}
                            height={60}
                            className="h-12 w-auto object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:block">
                        <Link href="/plan-trip">
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                                Start Planning
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className="sr-only">Open menu</span>
                        {mobileMenuOpen ? (
                            <X className="block h-6 w-6" aria-hidden="true" />
                        ) : (
                            <Menu className="block h-6 w-6" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent/10 hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/plan-trip"
                            className="block px-3 py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Button size="sm" className="w-full bg-accent hover:bg-accent/90">
                                Start Planning
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
