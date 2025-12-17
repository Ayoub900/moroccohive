"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"

interface ImageGalleryProps {
    images: string[]
    productName: string
    onImageRemove?: (index: number) => void
    editable?: boolean
}

export function ImageGallery({ images, productName, onImageRemove, editable }: ImageGalleryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const displayedImages = images && images.length > 0 ? images : ["/placeholder.svg"]
    const currentImage = displayedImages[currentImageIndex]

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? displayedImages.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev === displayedImages.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="space-y-4">
            {/* Main Image Display */}
            <div className="relative w-full bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <img
                    src={currentImage || "/placeholder.svg"}
                    alt={`${productName} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                />

                {displayedImages.length > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {displayedImages.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {displayedImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Thumbnail Strip */}
            {displayedImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {displayedImages.map((image, index) => (
                        <div key={index} className="relative flex-shrink-0">
                            <button
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-16 h-16 rounded border-2 overflow-hidden transition ${index === currentImageIndex ? "border-primary" : "border-border"
                                    }`}
                            >
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                            {editable && onImageRemove && displayedImages.length > 1 && (
                                <button
                                    onClick={() => onImageRemove(index)}
                                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Image Counter */}
            {displayedImages.length > 1 && (
                <p className="text-sm text-muted-foreground text-center">
                    Image {currentImageIndex + 1} of {displayedImages.length}
                </p>
            )}
        </div>
    )
}
