"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"

interface ImageUploadProps {
    onImagesAdd: (images: string[]) => void
    existingImages: string[]
    onRemoveImage: (index: number) => void
}

export function ImageUpload({ onImagesAdd, existingImages, onRemoveImage }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [previews, setPreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        setUploading(true)

        try {
            const formData = new FormData()
            files.forEach((file) => {
                formData.append("files", file)
            })

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const data = await response.json()
            setPreviews([...previews, ...data.urls])
            onImagesAdd(data.urls)

            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload images. Please try again.")
        } finally {
            setUploading(false)
        }
    }

    const handleRemovePreview = (index: number) => {
        setPreviews(previews.filter((_, i) => i !== index))
    }

    const totalImages = existingImages.length + previews.length

    return (
        <div className="space-y-3">
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition text-center"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                    {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    <div>
                        <p className="font-medium text-sm">{uploading ? "Uploading..." : "Click to upload or drag and drop"}</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>

            {(existingImages.length > 0 || previews.length > 0) && (
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{totalImages} image(s) added</p>
                    <div className="grid grid-cols-4 gap-2">
                        {existingImages.map((image, index) => (
                            <div key={`existing-${index}`} className="relative group">
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Product ${index}`}
                                    className="w-full h-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-destructive text-white rounded p-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        {previews.map((preview, index) => (
                            <div key={`preview-${index}`} className="relative group">
                                <img
                                    src={preview || "/placeholder.svg"}
                                    alt={`Preview ${index}`}
                                    className="w-full h-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemovePreview(index)}
                                    className="absolute top-1 right-1 bg-destructive text-white rounded p-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
