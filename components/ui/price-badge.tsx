"use client"

import * as React from "react"

interface PriceBadgeProps {
    price: number | null | undefined
    originalPrice?: number | null
    from?: boolean
}

function formatPrice(n?: number | null) {
    if (n == null) return "0"
    if (Number.isInteger(n)) return n.toLocaleString()
    return n.toFixed(2)
}

export function PriceBadge({ price, originalPrice, from }: PriceBadgeProps) {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-baseline">
                <span className="text-2xl font-bold">${formatPrice(price ?? 0)} <span className="text-muted-foreground font-medium">/ person</span></span>
                {originalPrice != null && (
                    <span className="text-sm text-muted-foreground line-through">${formatPrice(originalPrice)}</span>
                )}
            </div>
        </div>
    )
}

export default PriceBadge
