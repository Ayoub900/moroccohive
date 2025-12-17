"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"

export function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setSubmitStatus("success")
                setFormData({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                })
                setTimeout(() => setSubmitStatus("idle"), 3000)
            } else {
                setSubmitStatus("error")
            }
        } catch (error) {
            console.error("Failed to send message:", error)
            setSubmitStatus("error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section id="contact" className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have questions? Our team is here to help. Reach out to us anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Email */}
                    <Card>
                        <CardHeader>
                            <Mail className="w-8 h-8 text-primary mb-2" />
                            <CardTitle>Email</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">support@techhub.com</p>
                            <Button variant="link" className="p-0 h-auto mt-2">
                                Send an email
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Phone */}
                    <Card>
                        <CardHeader>
                            <Phone className="w-8 h-8 text-primary mb-2" />
                            <CardTitle>Phone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">+1 (234) 567-890</p>
                            <Button variant="link" className="p-0 h-auto mt-2">
                                Call us
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                        <CardHeader>
                            <MapPin className="w-8 h-8 text-primary mb-2" />
                            <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">123 Tech Street, Silicon Valley, CA 94025</p>
                            <Button variant="link" className="p-0 h-auto mt-2">
                                Get directions
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Form */}
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Send us a Message</CardTitle>
                        <CardDescription>We&apos;ll get back to you as soon as possible</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {submitStatus === "success" && (
                                <div className="p-4 bg-green-50 text-green-800 rounded-lg">
                                    Thank you for your message! We&apos;ll get back to you soon.
                                </div>
                            )}
                            {submitStatus === "error" && (
                                <div className="p-4 bg-red-50 text-red-800 rounded-lg">Failed to send message. Please try again.</div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                                />
                            </div>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                            />
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                rows={5}
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground resize-none"
                            />
                            <Button className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
