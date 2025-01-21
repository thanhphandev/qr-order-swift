"use server"

import connectDB from "@/lib/mongodb";
import { CreateOrderData, OrderType, status } from "@/types/order";
import { Order } from "@/models/Order";
import { pusherServer } from "@/lib/pusher";
import { Types } from 'mongoose';
import type { status as StatusType } from "@/types/order";
import { formatMoney } from "@/lib/utils";

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
                toppings: item.toppings?.map((topping: any) => ({
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

export const triggerOrder = async (order: OrderType) => {
    try {
        pusherServer.trigger('orders', 'new-order', {
            order
        })
    } catch (error: any) {
        throw new Error(error.message)
    }
}


export const triggerOrderStatus = async (orderId: string, status: StatusType): Promise<void> => {
    try {
        await pusherServer.trigger('orders', 'order-status', {
            orderId,
            status,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Failed to trigger order status: ${errorMessage}`);
        throw new Error(`Order status trigger failed: ${errorMessage}`);
    }
};

export const sendTelegramNotification = async (order: OrderType, token: string, chatID: string) => {
    try {
        const chatId = chatID; // Thay bằng ID chat hoặc lấy từ settings
        let message = `🛒 Đơn hàng mới:\n`;
        message += `- Loại: ${order.typeOrder}\n`;
        message += `- Tổng tiền: ${formatMoney(order.totalAmount)}\n`;
        message += `- Bàn: ${order.table || 'N/A'}\n`;

        // Customer Info
        if (order.customerInfo) {
            message += `- Tên KH: ${order.customerInfo?.customerName|| 'N/A'}\n`;
            message += `- SĐT: ${order.customerInfo?.phoneNumber || 'N/A'}\n`;
            message += `- Địa chỉ: ${order.customerInfo?.deliveryAddress || 'N/A'}\n`;
        }

        // Items details
        message += `\nCác món ăn:\n`;
        order.items.forEach(item => {
            message += `  * Món: ${item.name} x ${item.quantity} | Giá: ${formatMoney(item.price)}\n`;
            if (item.size) {
                message += `    - Kích thước: ${item.size}\n`;
            }
            if (item.toppings && item.toppings.length > 0) {
                message += `    - Toppings:\n`;
                item.toppings.forEach(topping => {
                    message += `      + ${topping.name} x ${topping.quantity} | Giá: ${formatMoney(topping.price)}\n`;
                });
            }
        });

        // Notes if available
        if (order.notes) {
            message += `\nGhi chú: ${order.notes}\n`;
        }

        // Prepare the fetch request
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
            }),
        });

        const data = await response.json();
        if (data.ok) {
            console.log('Thông báo Telegram gửi thành công');
        } else {
            console.error('Lỗi khi gửi thông báo Telegram:', data.description);
        }
    } catch (error) {
        console.error('Lỗi khi gửi thông báo Telegram:', error);
    }
};

export async function updateOrderStatus(orderId: string, status: status) {
    try {
        await connectDB();

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        await triggerOrderStatus(orderId, status);

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
        if (!Types.ObjectId.isValid(orderId)) {
            return null;  // Trả về null nếu orderId không hợp lệ
        }
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
        })) as OrderType[] || [];
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
