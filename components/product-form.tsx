"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "./rich-text-editor"
import { ImageUpload } from "./image-upload"

interface ProductFormProps {
    onSubmit: (data: ProductFormData) => Promise<void>
    initialData?: ProductFormData | null
    isLoading?: boolean
}

export interface ProductFormData {
    id?: string
    name: string
    description: string
    price: number
    images: string[]
    category: string
    stock: number
}

export function ProductForm({ onSubmit, initialData, isLoading }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductFormData>(
        initialData
            ? {
                id: initialData.id,
                name: initialData.name || "",
                description: initialData.description || "",
                price: initialData.price || 0,
                images: Array.isArray(initialData.images) ? initialData.images : [],
                category: initialData.category || "",
                stock: initialData.stock || 0,
            }
            : {
                name: "",
                description: "",
                price: 0,
                images: [],
                category: "",
                stock: 0,
            },
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.images.length === 0) {
            alert("Please add at least one image")
            return
        }
        await onSubmit(formData)
    }

    const handleAddImages = (newImages: string[]) => {
        setFormData({
            ...formData,
            images: [...formData.images, ...newImages],
        })
    }

    const handleRemoveImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium">Product Name *</label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    required
                />
            </div>

            <div>
                <label className="text-sm font-medium">Description</label>
                <RichTextEditor
                    value={formData.description}
                    onChange={(description) => setFormData({ ...formData, description })}
                    placeholder="Enter product description with formatting..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Price *</label>
                    <Input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                        placeholder="0.00"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Stock *</label>
                    <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
                        placeholder="0"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Audio, Accessories"
                />
            </div>

            <div>
                <label className="text-sm font-medium">Product Images *</label>
                <ImageUpload onImagesAdd={handleAddImages} existingImages={formData.images} onRemoveImage={handleRemoveImage} />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : "Save Product"}
            </Button>
        </form>
    )
}
