"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, User } from "lucide-react"

export default function ProfilePage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    // Form states
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)
        setLoading(true)

        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" })
            setLoading(false)
            return
        }

        if (newPassword.length < 8) {
            setMessage({ type: "error", text: "Password must be at least 8 characters" })
            setLoading(false)
            return
        }

        try {
            const { error } = await authClient.changePassword({
                newPassword: newPassword,
                currentPassword: currentPassword,
                revokeOtherSessions: true,
            })

            if (error) {
                setMessage({ type: "error", text: error.message || "Failed to update password" })
            } else {
                setMessage({ type: "success", text: "Password updated successfully" })
                setCurrentPassword("")
                setNewPassword("")
                setConfirmPassword("")
            }
        } catch (err) {
            setMessage({ type: "error", text: "An unexpected error occurred" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Profile Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your account and security</p>
            </div>

            {/* Profile Info */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={user?.name || ""}
                            disabled
                            className="bg-muted/50 border-input"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            value={user?.email || ""}
                            disabled
                            className="bg-muted/50 border-input"
                        />
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Lock className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Change Password</h2>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                        <Label htmlFor="current">Current Password</Label>
                        <Input
                            id="current"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="bg-background border-input"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="new">New Password</Label>
                        <Input
                            id="new"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="bg-background border-input"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirm">Confirm New Password</Label>
                        <Input
                            id="confirm"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="bg-background border-input"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    )
}
