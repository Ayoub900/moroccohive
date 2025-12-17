"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductForm, type ProductFormData } from "@/components/product-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewProductPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (formData: ProductFormData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/dashboard/products")
            }
        } catch (error) {
            console.error("Failed to add product:", error)
        } finally {
            setIsSubmitting(false)
        }
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
                        Add New Product
                    </h1>
                    <p className="text-muted-foreground mt-1">Create a new product for your store</p>
                </div>
            </div>

            {/* Form Card */}
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Fill in the information below to add a new product</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm onSubmit={handleSubmit} isLoading={isSubmitting} />
                </CardContent>
            </Card>
        </div>
    )
}
