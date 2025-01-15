"use server"

import connectDB from "@/lib/mongodb";
import { CreateOrderData, OrderType, status } from "@/types/order";
import { Order } from "@/models/Order";
import { pusherServer } from "@/lib/pusher";


export async function createOrder(orderData: CreateOrderData) {
    try {
        await connectDB();

        const newOrder = new Order(orderData);
        const order = await newOrder.save();

        return {
            _id: order._id.toString(),
            table: order.table,
            items: order.items.map((item: any) => ({
                _id: item._id.toString(),
                name: item.name,
                quantity: item.quantity,
                size: item.size,
                topping: item.topping?.map((topping: any) => ({
                    name: topping.name,
                    price: topping.price,
                    quantity: topping.quantity,
                })) || [],
                price: item.price,
            })) as OrderType['items'],
            status: order.status,
            typeOrder: order.typeOrder,
            customerInfo: order.customerInfo ? {
                customerName: order.customerInfo.name,
                phoneNumber: order.customerInfo.phone,
                deliveryAddress: order.customerInfo.address,
            } : null,
            totalAmount: order.totalAmount,
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        } as OrderType;
    } catch (error) {

        console.error('Error creating order:', error);
    }
}

export const triggerOrder = async(order: OrderType) => {
    try {
        pusherServer.trigger('orders', 'new-order', {
            order
        })
    } catch (error: any) {
        throw new Error(error.message) 
    }
}

export async function updateOrderStatus(orderId: string, status: status) {
    try {
        await connectDB();

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        return {
            id: updatedOrder._id.toString(),
            status: updatedOrder.status,
        }
    } catch (error) {

        console.error('Error updating order status:', error);
        throw new Error('Failed to update order status');
    }
}

/**
 * Delete an order
 * @param orderId Order ID
 * @returns Deleted order
 */
export async function deleteOrder(orderId: string) {
    try {

        await connectDB();

        const deletedOrder = await Order.findById(orderId);

        // Don't allow deletion of completed or paid orders
        if (['completed', 'paid'].includes(deletedOrder.status)) {
            throw new Error('Cannot delete completed or paid orders');
        }

        await deletedOrder.deleteOne();
        return {
            id: deletedOrder._id.toString(),
            status: deletedOrder.status,
        }
    } catch (error) {

        console.error('Error deleting order:', error);
        throw new Error('Failed to delete order');
    }
}


export async function getOrderById(orderId: string): Promise<OrderType | null> {
    try {
        await connectDB();

        const order = await Order.findById(orderId);
        if (!order) {
            return null;
        }

        return {
            _id: order._id.toString(),
            table: order.table,
            items: order.items.map((item: any) => ({
                _id: item._id.toString(),
                name: item.name,
                quantity: item.quantity,
                size: item.size,
                topping: item.topping?.map((topping: any) => ({
                    name: topping.name,
                    price: topping.price,
                })) || [],
                price: item.price,
            })) as OrderType['items'],
            status: order.status,
            typeOrder: order.typeOrder,
            customerInfo: order.customerInfo ? {
                customerName: order.customerInfo.name,
                phoneNumber: order.customerInfo.phone,
                deliveryAddress: order.customerInfo.address,
            } : null,
            totalAmount: order.totalAmount,
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        } as OrderType;

    } catch (error) {
        console.error('Error fetching order:', error);
        throw new Error('Failed to fetch order');
    }
}


export const getOrders = async (filters: {
    status?: status;
    typeOrder?: string;
    fromDate?: Date;
    toDate?: Date;
} = {}): Promise<OrderType[]> => {
    try {
        await connectDB();

        const query: any = {};

        // Thêm điều kiện lọc cho trạng thái đơn hàng nếu có
        if (filters.status) {
            query.status = filters.status;
        }

        // Thêm điều kiện lọc cho loại đơn hàng (dine-in, take-away, delivery)
        if (filters.typeOrder) {
            query.typeOrder = filters.typeOrder;
        }

        // Thêm điều kiện lọc cho ngày tạo đơn hàng (từ ngày và đến ngày)
        if (filters.fromDate || filters.toDate) {
            query.createdAt = {};
            if (filters.fromDate) {
                query.createdAt.$gte = filters.fromDate;
            }
            if (filters.toDate) {
                query.createdAt.$lte = filters.toDate;
            }
        }

        // Lấy các đơn hàng từ cơ sở dữ liệu
        const orders = await Order.find(query).sort({ createdAt: -1 });

        // Map lại dữ liệu đơn hàng theo đúng cấu trúc
        return orders.map((order: any) => ({
            _id: order._id.toString(),
            table: order.table,
            items: order.items.map((item: any) => ({
                _id: item._id.toString(),
                name: item.name,
                quantity: item.quantity,
                size: item.size,
                topping: item.topping?.map((topping: any) => ({
                    name: topping.name,
                    price: topping.price,
                })) || [],
                price: item.price,
            })) as OrderType['items'],
            status: order.status,
            typeOrder: order.typeOrder,
            customerInfo: order.customerInfo ? {
                customerName: order.customerInfo.name,
                phoneNumber: order.customerInfo.phone,
                deliveryAddress: order.customerInfo.address,
            } : null,
            totalAmount: order.totalAmount,
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        })) as OrderType[];
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
    }
};

// const orders = await getOrders({
//     status: 'pending', // Trạng thái đơn hàng
//     typeOrder: 'dine-in', // Loại đơn hàng (dine-in)
//     fromDate: new Date('2025-01-01'), // Lọc từ ngày
//     toDate: new Date('2025-01-31') // Lọc đến ngày
// });
// console.log(orders);
