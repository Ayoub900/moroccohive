import prisma from "@/lib/prisma"

async function main() {
    // Clear existing data
    await prisma.order.deleteMany({})
    await prisma.product.deleteMany({})

    // Create products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'MacBook Pro 16"',
                description:
                    "Powerful laptop for professionals with M3 Pro chip, 16GB unified memory, and stunning Liquid Retina XDR display",
                price: 2499.99,
                images: ["/macbook-pro.png", "/macbook-pro.png", "/macbook-pro.png"],
                category: "Laptops",
                stock: 12,
            },
        }),
        prisma.product.create({
            data: {
                name: "iPhone 15 Pro",
                description:
                    "Latest smartphone with advanced features, A17 Pro chip, advanced camera system, and titanium design",
                price: 999.99,
                images: ["/iphone-15-pro-hands.png", "/iphone-15-pro-hands.png", "/iphone-15-pro-hands.png"],
                category: "Phones",
                stock: 25,
            },
        }),
        prisma.product.create({
            data: {
                name: "AirPods Pro",
                description: "Wireless earbuds with active noise cancellation, transparency mode, and spatial audio",
                price: 249.99,
                images: ["/airpods-pro-lifestyle.png", "/airpods-pro-lifestyle.png", "/airpods-pro-lifestyle.png"],
                category: "Audio",
                stock: 3,
            },
        }),
        prisma.product.create({
            data: {
                name: "iPad Air",
                description: "Versatile tablet for work and entertainment with M1 chip and stunning Liquid Retina display",
                price: 599.99,
                images: ["/ipad-air-tablet.jpg", "/ipad-air-tablet.jpg", "/ipad-air-tablet.jpg"],
                category: "Tablets",
                stock: 8,
            },
        }),
        prisma.product.create({
            data: {
                name: "Apple Watch Series 9",
                description: "Advanced smartwatch with fitness tracking, health monitoring, and always-on display",
                price: 399.99,
                images: ["/apple-watch-series-9.jpg", "/apple-watch-series-9.jpg", "/apple-watch-series-9.jpg"],
                category: "Wearables",
                stock: 15,
            },
        }),
        prisma.product.create({
            data: {
                name: "Magic Keyboard",
                description: "Wireless keyboard with rechargeable battery, sleek aluminum design, and quiet keys",
                price: 299.99,
                images: ["/magic-keyboard.jpg", "/magic-keyboard.jpg", "/magic-keyboard.jpg"],
                category: "Accessories",
                stock: 0,
            },
        }),
        prisma.product.create({
            data: {
                name: "USB-C Hub",
                description: "Multi-port adapter for connectivity with multiple USB-C and USB-A ports",
                price: 79.99,
                images: ["/usb-c-hub.jpg", "/usb-c-hub.jpg", "/usb-c-hub.jpg"],
                category: "Accessories",
                stock: 42,
            },
        }),
        prisma.product.create({
            data: {
                name: "Dell XPS 13",
                description: "Compact laptop with stunning InfinityEdge display, powerful performance, and premium build",
                price: 1299.99,
                images: ["/dell-xps-13-laptop.jpg", "/dell-xps-13-laptop.jpg", "/dell-xps-13-laptop.jpg"],
                category: "Laptops",
                stock: 6,
            },
        }),
    ])

    // Create sample orders
    await Promise.all([
        prisma.order.create({
            data: {
                productId: products[0].id,
                productName: 'MacBook Pro 16"',
                fullName: "John Doe",
                email: "john@example.com",
                phone: "+1 (555) 123-4567",
                quantity: 1,
                price: 2499.99,
                totalPrice: 2499.99,
                status: "confirmed",
            },
        }),
        prisma.order.create({
            data: {
                productId: products[1].id,
                productName: "iPhone 15 Pro",
                fullName: "Jane Smith",
                email: "jane@example.com",
                phone: "+1 (555) 987-6543",
                quantity: 2,
                price: 999.99,
                totalPrice: 1999.98,
                status: "pending",
            },
        }),
        prisma.order.create({
            data: {
                productId: products[2].id,
                productName: "AirPods Pro",
                fullName: "Mike Johnson",
                email: "mike@example.com",
                phone: "+1 (555) 456-7890",
                quantity: 1,
                price: 249.99,
                totalPrice: 249.99,
                status: "shipped",
            },
        }),
    ])

    console.log("Seed completed successfully!")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
