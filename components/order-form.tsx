"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Check } from "lucide-react"

interface OrderFormProps {
    productId: string
    productName: string
    price: number
    stock: number
}

export function OrderForm({ productId, productName, price, stock }: OrderFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        quantity: 1,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Math.max(1, Math.min(stock, Number.parseInt(value) || 1)) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    productName,
                    price,
                    // quantity: formData.quantity,
                    totalPrice: price * formData.quantity,
                    ...formData,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to place order")
            }

            setSubmitted(true)
            setFormData({ fullName: "", email: "", phone: "", quantity: 1 })
            setTimeout(() => setSubmitted(false), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Place an Order</CardTitle>
                <CardDescription>Fill in your details to order this product</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Quantity <span className="text-muted-foreground">(Max: {stock})</span>
                        </label>
                        <Input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                            max={stock}
                            required
                            disabled={isSubmitting || stock === 0}
                        />
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="text-2xl font-bold text-primary">${(price * formData.quantity).toFixed(2)}</p>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/50 rounded p-3 flex gap-2">
                            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-destructive">{error}</p>
                        </div>
                    )}

                    {submitted && (
                        <div className="bg-secondary/10 border border-secondary/20 rounded p-3 flex gap-2">
                            <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-secondary">Order placed successfully!</p>
                        </div>
                    )}

                    <Button type="submit" size="lg" disabled={isSubmitting || stock === 0} className="w-full">
                        {isSubmitting ? "Placing Order..." : stock === 0 ? "Out of Stock" : "Place Order"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
