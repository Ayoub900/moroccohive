"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart } from "lucide-react"

interface Order {
    id: string
    productId: string
    productName: string
    fullName: string
    email: string
    phone: string
    quantity: number
    price: number
    totalPrice: number
    status: string
    createdAt: Date
    updatedAt: Date
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders")
            const data = await response.json()
            setOrders(data)
        } catch (error) {
            console.error("Failed to fetch orders:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                await fetchOrders()
            }
        } catch (error) {
            console.error("Failed to update order:", error)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            case "confirmed":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            case "shipped":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
            case "delivered":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-muted-foreground">Loading orders...</div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Orders
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage customer orders ({orders.length} orders)
                </p>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-border rounded-xl">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No orders yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Order ID</p>
                                        <p className="font-mono text-sm truncate">{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Product</p>
                                        <p className="font-medium">{order.productName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Customer</p>
                                        <p className="font-medium">{order.fullName}</p>
                                        <p className="text-xs text-muted-foreground">{order.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Qty / Total</p>
                                        <p className="font-medium">
                                            {order.quantity} x ${order.price.toFixed(2)}
                                        </p>
                                        <p className="text-sm font-bold text-primary">${order.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date</p>
                                        <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Select
                                            value={order.status}
                                            onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                                        >
                                            <SelectTrigger className={`text-xs ${getStatusColor(order.status)}`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
