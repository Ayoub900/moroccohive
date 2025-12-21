"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, MapPin, Phone, Mail, User, LogOut, LayoutDashboard, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { data: session, isPending } = authClient.useSession()
    const router = useRouter()

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                    router.refresh()
                },
            },
        })
    }

    const navigation = [
        { name: "Home", href: "/" },
        { name: "Trip Ideas", href: "/circuits" },
        { name: "Plan Your Trip", href: "/plan-trip" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/#contact" },
    ]

    return (
        <header className="relative w-full border-b border-border/40 bg-background/95">
            {/* Top Bar */}
            <div className="hidden lg:block bg-primary/10 border-b border-primary/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end items-center h-10 text-sm">
                        <div className="flex items-center space-x-6 text-muted-foreground">
                            <a href="tel:+212634717423" className="flex items-center hover:text-primary transition-colors">
                                <Phone className="w-3 h-3 mr-2" />
                                +212 634717423
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
                    {/* Mobile Burger (Left) */}
                    <div className="md:hidden flex-1 flex justify-start">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
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

                    {/* Logo (Middle on mobile, Left on desktop) */}
                    <div className="flex-1 md:flex-initial flex justify-center md:justify-start">
                        <Link href="/" className="flex items-center space-x-2">
                            <Image
                                src="/logo_1.PNG"
                                alt="MoroccoHive Logo"
                                width={180}
                                height={60}
                                className="h-10 md:h-12 w-auto object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation (Middle) */}
                    <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
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

                    {/* Right side: Auth/User Menu */}
                    <div className="flex-1 md:flex-initial flex items-center justify-end space-x-4">
                        {!isPending && (
                            <>
                                {session ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                                            className="flex items-center space-x-2 p-1 rounded-full hover:bg-accent/10 transition-colors border border-transparent hover:border-border"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {session.user.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                                            </div>
                                            <span className="hidden md:inline text-sm font-medium text-foreground">{session.user.name?.split(' ')[0]}</span>
                                        </button>

                                        {userMenuOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setUserMenuOpen(false)}
                                                />
                                                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <User className="w-4 h-4 mr-2" />
                                                        Profile
                                                    </Link>
                                                    <Link
                                                        href="/profile#favorites"
                                                        className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors"
                                                        onClick={() => setUserMenuOpen(false)}
                                                    >
                                                        <Heart className="w-4 h-4 mr-2" />
                                                        My Favorites
                                                    </Link>
                                                    {(session.user as any).role === 'admin' && (
                                                        <Link
                                                            href="/dashboard"
                                                            className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent/10 transition-colors"
                                                            onClick={() => setUserMenuOpen(false)}
                                                        >
                                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                                            Admin Dashboard
                                                        </Link>
                                                    )}
                                                    <div className="h-px bg-border my-1" />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4 mr-2" />
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Link href="/login" className="hidden md:block">
                                            <Button variant="ghost" size="sm">Log In</Button>
                                        </Link>
                                        <Link href="/login" className="md:hidden p-2 text-foreground">
                                            <User className="w-6 h-6" />
                                        </Link>
                                        <Link href="/plan-trip" className="hidden md:block">
                                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                                                Start Planning
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
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
