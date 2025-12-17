import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        if (!id) return Response.json({ error: "Failed to fetch product" }, { status: 500 })

        const product = await prisma.product.findUnique({
            where: { id },
        })

        if (!product) {
            return Response.json({ error: "Product not found" }, { status: 404 })
        }

        return Response.json(product)
    } catch (error) {
        console.error("Error:", error)
        return Response.json({ error: "Failed to fetch product" }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const { name, description, price, images, category, stock } = await request.json()

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price,
                images,
                category,
                stock,
            },
        })

        return Response.json(product)
    } catch (error) {
        console.error("Error:", error)
        return Response.json({ error: "Failed to update product" }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        await prisma.product.delete({
            where: { id },
        })

        return Response.json({ success: true })
    } catch (error) {
        console.error("Error:", error)
        return Response.json({ error: "Failed to delete product" }, { status: 500 })
    }
}