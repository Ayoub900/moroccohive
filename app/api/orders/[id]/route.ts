import prisma from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const { status } = await request.json()

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        })

        return Response.json(order)
    } catch (error) {
        console.error("Error:", error)
        return Response.json({ error: "Failed to update order" }, { status: 500 })
    }
}