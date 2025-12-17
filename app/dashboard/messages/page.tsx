"use client"

import { useEffect, useState } from "react"
import { Mail, Search, Eye, Trash } from "lucide-react"

interface ContactMessage {
    id: string
    name: string
    email: string
    subject: string
    message: string
    status: string
    createdAt: string
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

    useEffect(() => {
        fetchMessages()
    }, [])

    const fetchMessages = async () => {
        try {
            const response = await fetch("/api/admin/messages", {
                credentials: "include"
            })

            if (response.ok) {
                const data = await response.json()
                setMessages(data)
            }
        } catch (error) {
            console.error("Failed to fetch:", error)
        } finally {
            setLoading(false)
        }
    }

    const deleteMessage = async (id: string) => {
        if (!confirm("Delete this message?")) return

        try {
            const response = await fetch(`/api/admin/messages/${id}`, {
                method: "DELETE",
                credentials: "include"
            })

            if (response.ok) {
                fetchMessages()
                if (selectedMessage?.id === id) {
                    setSelectedMessage(null)
                }
            }
        } catch (error) {
            console.error("Failed to delete:", error)
        }
    }

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/admin/messages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: "read" })
            })
            fetchMessages()
        } catch (error) {
            console.error("Failed to update:", error)
        }
    }

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const newMessages = messages.filter(m => m.status === "new").length

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Messages</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {messages.length} total messages
                    {newMessages > 0 && ` • ${newMessages} unread`}
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
            </div>

            {/* Messages List */}
            {filteredMessages.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No messages</h3>
                    <p className="text-muted-foreground">Contact messages will appear here</p>
                </div>
            ) : (
                <div className="bg-card rounded-lg border border-border">
                    <div className="divide-y divide-border">
                        {filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => {
                                    setSelectedMessage(message)
                                    if (message.status === "new") markAsRead(message.id)
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            {message.status === "new" && (
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                            )}
                                            <h3 className={`font-medium ${message.status === "new" ? "text-foreground" : "text-muted-foreground"}`}>
                                                {message.name}
                                            </h3>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(message.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{message.email}</p>
                                        {message.subject && (
                                            <p className="text-sm font-medium text-foreground mb-1">{message.subject}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground truncate">{message.message}</p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedMessage(message)
                                            }}
                                            className="text-muted-foreground hover:text-foreground"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deleteMessage(message.id)
                                            }}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">{selectedMessage.name}</h2>
                                <p className="text-sm text-muted-foreground mt-1">{selectedMessage.email}</p>
                            </div>
                            <button
                                onClick={() => setSelectedMessage(null)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {selectedMessage.subject && (
                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-1">Subject</h3>
                                    <p className="text-foreground">{selectedMessage.subject}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Message</h3>
                                <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>

                            <div className="pt-4 border-t border-border">
                                <p className="text-sm text-muted-foreground">
                                    Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium"
                                >
                                    Reply via Email
                                </a>
                                <button
                                    onClick={() => deleteMessage(selectedMessage.id)}
                                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm font-medium"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

