"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar, MapPin, Users, Mail, Phone, Search } from "lucide-react"

interface TripRequest {
    id: string
    travelStyle: string
    travelDates: string
    arrivalCity: string
    departureCity: string
    accommodation: string
    budget: string
    adventureActivities: string[]
    experiences: string[]
    importantFactors: string[]
    desiredExperiences: string
    numberOfTravelers: number
    travelerAges: string
    fullName: string
    email: string
    phone: string
    status: string
    createdAt: string
}

const statusStyles = {
    new: "bg-orange-50 text-orange-700 border-orange-200",
    contacted: "bg-blue-50 text-blue-700 border-blue-200",
    "in-progress": "bg-purple-50 text-purple-700 border-purple-200",
    quoted: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-300",
}

export default function TripRequestsPage() {
    const [requests, setRequests] = useState<TripRequest[]>([])
    const [selectedRequest, setSelectedRequest] = useState<TripRequest | null>(null)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [updating, setUpdating] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const itemsPerPage = 6

    useEffect(() => {
        // Reset and fetch when filter changes
        setRequests([])
        setCurrentPage(1)
        setHasMore(true)
        fetchRequests(1, true)
    }, [statusFilter])

    const fetchRequests = async (page: number, isInitial: boolean = false) => {
        if (isInitial) setLoading(true)
        else setLoadingMore(true)

        try {
            const url = statusFilter === "all"
                ? `/api/admin/trip-requests?page=${page}&limit=${itemsPerPage}`
                : `/api/admin/trip-requests?status=${statusFilter}&page=${page}&limit=${itemsPerPage}`

            const response = await fetch(url, { credentials: "include" })

            if (response.ok) {
                const data = await response.json()
                if (isInitial) {
                    setRequests(data.tripRequests)
                } else {
                    setRequests(prev => [...prev, ...data.tripRequests])
                }
                setHasMore(data.pagination.currentPage < data.pagination.pages)
            }
        } catch (error) {
            console.error("Failed to fetch:", error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = currentPage + 1
            setCurrentPage(nextPage)
            fetchRequests(nextPage)
        }
    }

    const updateStatus = async (id: string, newStatus: string) => {
        setUpdating(true)
        try {
            const response = await fetch(`/api/admin/trip-requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                await fetchRequests(1, true)
                setCurrentPage(1)
                if (selectedRequest?.id === id) {
                    setSelectedRequest({ ...selectedRequest, status: newStatus })
                }
            }
        } catch (error) {
            console.error("Failed to update:", error)
        } finally {
            setUpdating(false)
        }
    }

    const filteredRequests = requests.filter(req =>
        req.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Trip Requests</h1>
                <p className="text-sm text-muted-foreground mt-1">{requests.length} total requests</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        />
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", "new", "contacted", "in-progress", "quoted", "confirmed"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${statusFilter === status
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {status === "all" ? "All" : status.replace("-", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List */}
            {filteredRequests.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
                    <p className="text-muted-foreground">
                        {statusFilter === "all"
                            ? "No trip requests yet"
                            : `No ${statusFilter} requests`}
                    </p>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border">
                    <div className="divide-y divide-border">
                        {filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                onClick={() => setSelectedRequest(request)}
                                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-medium text-foreground">{request.fullName}</h3>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded border ${statusStyles[request.status as keyof typeof statusStyles] || statusStyles.new}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{request.travelDates}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                <span>{request.arrivalCity}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{request.numberOfTravelers} travelers</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More trigger */}
                    {hasMore && (
                        <div className="p-4 flex justify-center">
                            <Button
                                variant="ghost"
                                onClick={loadMore}
                                disabled={loadingMore}
                                className="text-muted-foreground"
                            >
                                {loadingMore ? "Loading more..." : "Scroll for more or Click to load"}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border">
                        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">{selectedRequest.fullName}</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {new Date(selectedRequest.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedRequest(null)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Update */}
                            <div className="bg-muted/50 border border-border rounded-lg p-4">
                                <h3 className="text-sm font-medium text-foreground mb-3">Update Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    {["new", "contacted", "in-progress", "quoted", "confirmed", "cancelled"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateStatus(selectedRequest.id, status)}
                                            disabled={updating}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${selectedRequest.status === status
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-card text-foreground border border-input hover:bg-accent hover:text-accent-foreground"
                                                }`}
                                        >
                                            {status.replace("-", " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Travel Details</h3>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">Style:</span>
                                            <p className="text-foreground font-medium capitalize">{selectedRequest.travelStyle}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Dates:</span>
                                            <p className="text-foreground font-medium">{selectedRequest.travelDates}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Route:</span>
                                            <p className="text-foreground font-medium">{selectedRequest.arrivalCity} → {selectedRequest.departureCity}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Accommodation:</span>
                                            <p className="text-foreground font-medium capitalize">{selectedRequest.accommodation}</p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Budget:</span>
                                            <p className="text-foreground font-medium">{selectedRequest.budget}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Contact</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <a href={`mailto:${selectedRequest.email}`} className="text-primary hover:underline">
                                                {selectedRequest.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <a href={`tel:${selectedRequest.phone}`} className="text-primary hover:underline">
                                                {selectedRequest.phone}
                                            </a>
                                        </div>
                                        <div className="pt-2">
                                            <Button
                                                onClick={() => window.location.href = `mailto:${selectedRequest.email}?subject=Regarding Your Trip Request to Morocco`}
                                                size="sm"
                                                className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                                            >
                                                <Mail className="w-4 h-4 mr-2" />
                                                Contact via Email
                                            </Button>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Travelers:</span>
                                            <p className="text-foreground font-medium">{selectedRequest.numberOfTravelers}</p>
                                            <p className="text-foreground font-medium">{selectedRequest.travelerAges}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activities */}
                            {selectedRequest.adventureActivities.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Activities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.adventureActivities.map((activity) => (
                                            <span key={activity} className="px-3 py-1 bg-muted text-foreground rounded text-sm">
                                                {activity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Target Experiences */}
                            {selectedRequest.experiences && selectedRequest.experiences.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Target Experiences</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.experiences.map((exp) => (
                                            <span key={exp} className="px-3 py-1 bg-primary/10 text-primary rounded text-sm border border-primary/20">
                                                {exp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Important Factors */}
                            {selectedRequest.importantFactors && selectedRequest.importantFactors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Key Priorities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRequest.importantFactors.map((factor) => (
                                            <span key={factor} className="px-3 py-1 bg-accent/10 text-accent rounded text-sm border border-accent/20">
                                                {factor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Desired Experiences (Additional Info) */}
                            <div>
                                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Additional Information</h3>
                                <p className="text-sm text-foreground bg-muted p-4 rounded-lg border border-border">
                                    {selectedRequest.desiredExperiences}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

