"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Map, Calendar, Plus, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Circuit {
    id: string
    name: string
    category: string
}

interface TripRequest {
    id: string
    status: string
    fullName: string
    createdAt: string
}

export default function DashboardPage() {
    const [circuits, setCircuits] = useState<Circuit[]>([])
    const [tripRequests, setTripRequests] = useState<TripRequest[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAllData()
    }, [])

    const fetchAllData = async () => {
        try {
            const [circuitsRes, requestsRes] = await Promise.all([
                fetch("/api/admin/circuits", { credentials: "include" }),
                fetch("/api/admin/trip-requests", { credentials: "include" }),
            ])

            if (circuitsRes.ok) {
                const data = await circuitsRes.json()
                setCircuits(data.circuits || [])
            }

            if (requestsRes.ok) {
                const data = await requestsRes.json()
                setTripRequests(data.tripRequests || [])
            }
        } catch (error) {
            console.error("Failed to fetch data:", error)
        } finally {
            setLoading(false)
        }
    }

    const newRequests = Array.isArray(tripRequests) ? tripRequests.filter((r) => r.status === "new").length : 0
    const totalRequests = Array.isArray(tripRequests) ? tripRequests.length : 0

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Circuits</p>
                            <p className="text-3xl font-semibold text-foreground mt-2">{circuits.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Map className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <Link href="/dashboard/circuits" className="text-sm text-primary hover:text-primary/80 mt-4 inline-flex items-center">
                        View all <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Trip Requests</p>
                            <p className="text-3xl font-semibold text-foreground mt-2">{totalRequests}</p>
                        </div>
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-secondary-foreground" />
                        </div>
                    </div>
                    <Link href="/dashboard/trip-requests" className="text-sm text-primary hover:text-primary/80 mt-4 inline-flex items-center">
                        View all <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">New Requests</p>
                            <p className="text-3xl font-semibold text-foreground mt-2">{newRequests}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${newRequests > 0 ? 'bg-destructive/10' : 'bg-muted'
                            }`}>
                            <TrendingUp className={`h-6 w-6 ${newRequests > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        {newRequests > 0 ? 'Requires attention' : 'All caught up!'}
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href="/dashboard/circuits/new"
                        className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                    >
                        <Map className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-medium text-foreground mb-1">Add New Circuit</h3>
                        <p className="text-sm text-muted-foreground">Create a new tour package</p>
                    </Link>
                    <Link
                        href="/dashboard/trip-requests"
                        className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                    >
                        <Calendar className="h-8 w-8 text-primary mb-3" />
                        <h3 className="font-medium text-foreground mb-1">View Requests</h3>
                        <p className="text-sm text-muted-foreground">Manage trip inquiries</p>
                    </Link>
                </div>
            </div>

            {/* Recent Trip Requests */}
            {tripRequests.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground">Recent Trip Requests</h2>
                        <Link href="/dashboard/trip-requests" className="text-sm text-primary hover:text-primary/80">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {tripRequests.slice(0, 5).map((request) => (
                            <Link
                                key={request.id}
                                href="/dashboard/trip-requests"
                                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${request.status === "new" ? "bg-destructive" :
                                        request.status === "contacted" ? "bg-secondary-foreground" :
                                            request.status === "confirmed" ? "bg-green-500" : "bg-muted-foreground"
                                        }`} />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{request.fullName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs px-2 py-1 bg-muted text-foreground rounded capitalize">
                                    {request.status}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {circuits.length === 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Map className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to Your Dashboard!</h3>
                            <p className="text-muted-foreground mb-4">
                                Start by adding your first circuit to showcase your Morocco tours.
                            </p>
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Link href="/dashboard/circuits/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Circuit
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

