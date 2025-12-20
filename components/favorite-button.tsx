"use client"

import { useState, useEffect } from "react"
import { Heart, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
    circuitId: string
    className?: string
}

export function FavoriteButton({ circuitId, className }: FavoriteButtonProps) {
    const { data: session } = authClient.useSession()
    const [isFavorited, setIsFavorited] = useState(false)
    const [favoriteId, setFavoriteId] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (session) {
            checkIfFavorited()
        } else {
            setLoading(false)
        }
    }, [session, circuitId])

    const checkIfFavorited = async () => {
        try {
            const res = await fetch("/api/favorites")
            const data = await res.json()
            const found = data.find((f: any) => f.circuitId === circuitId)
            if (found) {
                setIsFavorited(true)
                setFavoriteId(found.id)
            }
        } catch (error) {
            console.error("Error checking favorite status:", error)
        } finally {
            setLoading(false)
        }
    }

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!session) {
            router.push("/login")
            return
        }

        setActionLoading(true)
        try {
            if (isFavorited && favoriteId) {
                const res = await fetch(`/api/favorites/${favoriteId}`, { method: "DELETE" })
                if (res.ok) {
                    setIsFavorited(false)
                    setFavoriteId(null)
                }
            } else {
                const res = await fetch("/api/favorites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ circuitId }),
                })
                if (res.ok) {
                    const data = await res.json()
                    setIsFavorited(true)
                    setFavoriteId(data.id)
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error)
        } finally {
            setActionLoading(false)
        }
    }

    if (loading) {
        return (
            <div className={cn("inline-flex items-center justify-center translate-all", className)}>
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <button
            onClick={toggleFavorite}
            disabled={actionLoading}
            className={cn(
                "inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 shadow-sm",
                isFavorited
                    ? "bg-destructive text-white shadow-destructive/20"
                    : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-white",
                className
            )}
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
            <Heart className={cn("w-5 h-5", isFavorited && "fill-current")} />
        </button>
    )
}
