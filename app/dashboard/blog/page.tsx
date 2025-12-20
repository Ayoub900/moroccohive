"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreVertical, Edit, Trash, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function BlogListPage() {
    const router = useRouter()
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })

    useEffect(() => {
        fetchBlogs()
    }, [pagination.page])

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/admin/blog?page=${pagination.page}&limit=10`, {
                credentials: "include"
            })
            if (response.ok) {
                const data = await response.json()
                setBlogs(data.data)
                setPagination(prev => ({ ...prev, totalPages: data.pagination.totalPages }))
            }
        } catch (error) {
            console.error("Failed to fetch blogs:", error)
        } finally {
            setLoading(false)
        }
    }

    const deleteBlog = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog post?")) return

        try {
            const response = await fetch(`/api/admin/blog/${id}`, {
                method: "DELETE",
                credentials: "include"
            })
            if (response.ok) {
                fetchBlogs()
            } else {
                alert("Failed to delete blog post")
            }
        } catch (error) {
            console.error("Error deleting blog:", error)
            alert("Failed to delete blog post")
        }
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Blog Posts</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your website's blog content</p>
                </div>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Link href="/dashboard/blog/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Post
                    </Link>
                </Button>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto overflow-y-hidden">
                    <table className="w-full min-w-[800px] text-left table-fixed">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="w-2/5 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all">Post</th>
                                <th className="w-1/5 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="w-1/5 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                                <th className="w-1/5 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array(5).fill(0).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-2/3"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="h-8 w-8 opacity-20" />
                                            <p>No blog posts found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {blog.coverImage ? (
                                                    <img src={blog.coverImage} className="w-10 h-10 rounded object-cover border border-border" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-foreground">{blog.title}</div>
                                                    <div className="text-xs text-muted-foreground">/{blog.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${blog.published
                                                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                                : "bg-muted text-muted-foreground border border-border"
                                                }`}>
                                                {blog.published ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/blog/${blog.slug}`} target="_blank">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/dashboard/blog/${blog.id}/edit`}>
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteBlog(blog.id)}>
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
