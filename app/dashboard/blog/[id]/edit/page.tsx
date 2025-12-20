"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Save, Plus, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { RichTextEditor } from "@/components/rich-text-editor"
import { ImageUpload } from "@/components/image-upload"

export default function EditBlogPostPage() {
    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        author: "",
        tags: [] as string[],
        published: false,
    })

    const [currentTag, setCurrentTag] = useState("")

    useEffect(() => {
        fetchPost()
    }, [])

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/admin/blog/${params.id}`, {
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                setFormData(data)
            }
        } catch (error) {
            console.error("Failed to fetch:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const response = await fetch(`/api/admin/blog/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                router.push("/dashboard/blog")
            } else {
                alert("Failed to update blog post")
            }
        } catch (error) {
            console.error("Error:", error)
            alert("Failed to update blog post")
        } finally {
            setSaving(false)
        }
    }

    const addTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, currentTag.trim()]
            })
            setCurrentTag("")
        }
    }

    const removeTag = (index: number) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((_, i) => i !== index)
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-500">Loading post details...</div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/blog">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Edit Blog Post</h1>
                    <p className="text-sm text-muted-foreground mt-1">Update your published content</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Post Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="bg-background border-input text-lg font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug *</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                            required
                            className="bg-background border-input"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt / Summary</Label>
                        <Textarea
                            id="excerpt"
                            value={formData.excerpt || ""}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="A short summary for the blog listing page..."
                            rows={3}
                            className="bg-background border-input resize-none"
                        />
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <Label>Cover Image</Label>
                    <ImageUpload
                        existingImages={formData.coverImage ? [formData.coverImage] : []}
                        onImagesAdd={(urls) => setFormData({ ...formData, coverImage: urls[0] })}
                        onRemoveImage={() => setFormData({ ...formData, coverImage: "" })}
                        max={1}
                    />
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                    <Label>Post Content (Rich Text)</Label>
                    <RichTextEditor
                        value={formData.content}
                        onChange={(val) => setFormData({ ...formData, content: val })}
                        placeholder="Start writing your story..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                placeholder="Add tag"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="bg-background border-input"
                            />
                            <Button type="button" onClick={addTag} size="icon" variant="outline">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, idx) => (
                                <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                                    {tag}
                                    <button type="button" onClick={() => removeTag(idx)}>
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <Label>Publish Settings</Label>
                        <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                            <div className="space-y-0.5">
                                <Label className="text-base font-medium">Published</Label>
                                <p className="text-sm text-muted-foreground">Make this post public</p>
                            </div>
                            <Switch
                                checked={formData.published}
                                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="author">Author</Label>
                            <Input
                                id="author"
                                value={formData.author || ""}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="bg-background border-input h-9"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]">
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? "Saving..." : "Update Post"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    )
}
