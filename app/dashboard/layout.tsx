import { Sidebar, SidebarContent } from "@/components/dashboard/sidebar"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Map } from "lucide-react"
import Image from "next/image"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/admin/login")
    }

    if ((session.user as any).role !== "admin") {
        redirect("/access-denied")
    }

    return (
        <div className="min-h-screen bg-background flex flex-col lg:flex-row">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo_1.PNG"
                        alt="MoroccoHive"
                        width={180}
                        height={60}
                        className="h-12 w-auto object-contain"
                        priority
                    />
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
