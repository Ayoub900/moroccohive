import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        })
        return Response.json(orders)
    } catch (error) {
        console.error("Error:", error)
        return Response.json({ error: "Failed to fetch orders" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const { productId, productName, fullName, email, phone, quantity, price, totalPrice } = await request.json()

        const order = await prisma.order.create({
            data: {
                productId,
                productName,
                fullName,
                email,
                phone,
                quantity,
                price,
                totalPrice,
                status: "pending",
            },
        })

        return Response.json(order, { status: 201 })
    } catch (error) {
        console.error("Error:", error)
        return Response.json({ error: "Failed to create order" }, { status: 500 })
    }
}
