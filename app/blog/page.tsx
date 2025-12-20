"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileText, Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BlogListingPage() {
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })

    useEffect(() => {
        fetchBlogs()
        window.scrollTo(0, 0)
    }, [pagination.page])

    const fetchBlogs = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/blog?page=${pagination.page}&limit=9`)
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

    return (
        <main className="min-h-screen bg-background">
            <Header />

            {/* Header */}
            <section className="relative pt-32 pb-20 bg-primary overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image
                        src="/hero-bg.png"
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Morocco Hive Blog</h1>
                    <p className="text-white/80 max-w-2xl mx-auto text-lg">
                        Stories, travel tips, and cultural insights from the heart of Morocco.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 container mx-auto px-6">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                                <div className="aspect-[16/10] bg-muted"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-4 bg-muted rounded w-1/4"></div>
                                    <div className="h-6 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h2 className="text-2xl font-semibold">No posts yet</h2>
                        <p className="text-muted-foreground mt-2">Check back soon for more stories!</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        {post.coverImage ? (
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <FileText className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                        )}
                                        {post.tags?.[0] && (
                                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                                                {post.tags[0]}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {post.author || "Morocco Hive"}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                            {post.excerpt || "Discover more about this journey through Morocco..."}
                                        </p>

                                        <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider">
                                            Read More
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="px-6 py-2 rounded-full border border-border hover:border-primary disabled:opacity-50 disabled:hover:border-border transition-colors font-medium"
                                >
                                    Previous
                                </button>
                                <span className="text-muted-foreground font-medium">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-6 py-2 rounded-full border border-border hover:border-primary disabled:opacity-50 disabled:hover:border-border transition-colors font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>

            <Footer />
        </main>
    )
}
