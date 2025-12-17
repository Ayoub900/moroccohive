import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/limiter";

export async function GET(request: NextRequest) {
    const rateLimitError = await checkRateLimit("general");
    if (rateLimitError) return rateLimitError;

    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get("status")

        const where: any = {}
        if (status) {
            where.status = status
        }

        const tripRequests = await prisma.tripRequest.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
        })

        console.log("Found trip requests:", tripRequests.length)
        return NextResponse.json(tripRequests)
    } catch (error) {
        console.error("Error fetching trip requests:", error)
        return NextResponse.json({ error: "Failed to fetch trip requests" }, { status: 500 })
    }
}
