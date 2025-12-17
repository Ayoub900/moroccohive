import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
        })
        return new Response(JSON.stringify(products), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        console.error("[v0] Products API error:", error)
        return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}

export async function POST(request: Request) {
    try {
        const { name, description, price, images, category, stock } = await request.json()

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                images: images && images.length > 0 ? images : ["/placeholder.svg"],
                category,
                stock,
            },
        })

        return new Response(JSON.stringify(product), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        console.error("[v0] Create product error:", error)
        return new Response(JSON.stringify({ error: "Failed to create product" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
