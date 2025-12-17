"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Package } from "lucide-react"

interface Product {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    category: string
    stock: number
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch("/api/products")
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error("Failed to fetch products:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            })

            if (response.ok) {
                await fetchProducts()
            }
        } catch (error) {
            console.error("Failed to delete product:", error)
        }
    }

    const handleEditClick = (product: Product) => {
        window.location.href = `/dashboard/products/${product.id}/edit`
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading products...</div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Products
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your product catalog ({products.length} products)
                    </p>
                </div>
                <Link href="/dashboard/products/new">
                    <Button size="lg" className="gap-2">
                        <Plus className="h-5 w-5" />
                        Add New Product
                    </Button>
                </Link>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-4">No products yet</p>
                    <Link href="/dashboard/products/new">
                        <Button>Create Your First Product</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            isAdmin
                            onEdit={handleEditClick}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
