"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProductCardProps {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    category: string
    stock: number
    onEdit?: (product: {
        id: string
        name: string
        description: string
        price: number
        images: string[]
        category: string
        stock: number
    }) => void
    onDelete?: (id: string) => void
    isAdmin?: boolean
}

export function ProductCard({
    id,
    name,
    description,
    price,
    images,
    category,
    stock,
    onEdit,
    onDelete,
    isAdmin,
}: ProductCardProps) {
    const mainImage = images && images.length > 0 ? images[0] : "/placeholder.svg"

    const cardContent = (
        <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
            <div className="relative w-full bg-muted aspect-square overflow-hidden">
                <img
                    src={mainImage || "/placeholder.svg"}
                    alt={name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                />

                {/* Stock Badge */}
                <div className="absolute top-4 right-4">
                    {stock < 5 && stock > 0 && (
                        <div className="bg-yellow-600 text-white px-2 py-1 rounded text-sm">Low Stock</div>
                    )}
                    {stock === 0 && <div className="bg-destructive text-white px-2 py-1 rounded text-sm">Out of Stock</div>}
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">{name}</h3>
                <p className="text-2xl font-bold text-primary mb-2">${price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mb-4">Stock: {stock} units</p>

                {isAdmin ? (
                    <div className="flex gap-2 mt-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault()
                                onEdit?.({ id, name, description, price, images, category, stock })
                            }}
                            className="flex-1"
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault()
                                onDelete?.(id)
                            }}
                            className="flex-1"
                        >
                            Delete
                        </Button>
                    </div>
                ) : (
                    <Button className="w-full mt-auto" disabled={stock === 0}>
                        {stock > 0 ? "View Details" : "Out of Stock"}
                    </Button>
                )}
            </div>
        </div>
    )

    if (isAdmin) {
        return cardContent
    }

    return <Link href={`/products/${id}`}>{cardContent}</Link>
}
