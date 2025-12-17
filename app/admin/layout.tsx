import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminAuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        if ((session.user as any).role === "admin") {
            redirect("/dashboard")
        } else {
            redirect("/")
        }
    }

    return <>{children}</>
}
