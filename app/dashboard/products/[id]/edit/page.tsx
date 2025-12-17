"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ProductForm, type ProductFormData } from "@/components/product-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Product {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    category: string
    stock: number
}

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchProduct()
    }, [params.id])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`)
            if (response.ok) {
                const data = await response.json()
                setProduct(data)
            } else {
                router.push("/dashboard/products")
            }
        } catch (error) {
            console.error("Failed to fetch product:", error)
            router.push("/dashboard/products")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (formData: ProductFormData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/products/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/dashboard/products")
            }
        } catch (error) {
            console.error("Failed to update product:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading product...</div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Product not found</div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Edit Product
                    </h1>
                    <p className="text-muted-foreground mt-1">Update product information</p>
                </div>
            </div>

            {/* Form Card */}
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Update the information below to modify the product</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm
                        onSubmit={handleSubmit}
                        initialData={product}
                        isLoading={isSubmitting}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
