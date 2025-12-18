import type { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://moroccohive.com"

    // Fetch all active circuits
    const circuits = await prisma.circuit.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
    })

    const circuitEntries = circuits.map((circuit) => ({
        url: `${baseUrl}/circuits/${circuit.slug}`,
        lastModified: circuit.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }))

    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/circuits`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/plan-trip`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        },
    ]

    return [...staticPages, ...circuitEntries]
}
