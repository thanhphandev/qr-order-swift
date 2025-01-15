"use server";

import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import dayjs from 'dayjs';
import { RevenueData, ProductData, OrderStatusData, PendingOrder } from "@/types/dashboard";

/**
 * Get revenue trends
 * @param fromDate Start date for filtering (optional)
 * @param toDate End date for filtering (optional)
 * @returns Revenue data by day within the given period
 */
export const getRevenueTrends = async (fromDate?: Date, toDate?: Date): Promise<RevenueData[]> => {
    try {
        await connectDB();

        const query: Record<string, any> = { status: "paid" }
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = fromDate;
            if (toDate) query.createdAt.$lte = toDate;
        }

        const orders = await Order.find(query);

        // Group revenue by day
        const revenueByDay: Record<string, number> = {};
        orders.forEach(order => {
            const day = order.createdAt.toISOString().split("T")[0];
            revenueByDay[day] = (revenueByDay[day] || 0) + order.totalAmount;
        });

        return Object.entries(revenueByDay).map(([date, value]) => ({
            name: date,
            value,
        }));
    } catch (error) {
        console.error("Error fetching revenue trends:", error);
        throw new Error("Failed to fetch revenue trends");
    }
};

/**
 * Get top-selling items
 * @param limit Number of top items to fetch
 * @returns List of top-selling products
 */
export const getTopProducts = async (limit = 5): Promise<ProductData[]> => {
    try {
        await connectDB();

        const orders = await Order.find();

        // Aggregate sales data
        const productSales: Record<string, ProductData> = {};
        orders.forEach(order => {
            order.items.forEach((item: { name: string; quantity: number; price: number }) => {
                if (!productSales[item.name]) {
                    productSales[item.name] = {
                        name: item.name,
                        value: 0,
                    };
                }
                productSales[item.name].value += item.quantity;
            });
        });

        // Sort and return top products
        return Object.values(productSales)
            .sort((a, b) => b.value - a.value)
            .slice(0, limit);
    } catch (error) {
        console.error("Error fetching top products:", error);
        throw new Error("Failed to fetch top products");
    }
};

/**
 * Get order status statistics
 * @returns Count of orders grouped by status
 */
export const getOrderStatuses = async (): Promise<{ statuses: OrderStatusData[]; totalOrdersToday: number }> => {
    try {
        await connectDB();

        const orders = await Order.find();

        // Lấy thời gian bắt đầu của ngày hôm nay
        const startOfToday = dayjs().startOf('day').toDate();
        const endOfToday = dayjs().endOf('day').toDate();

        // Tính tổng số đơn hàng trong ngày hôm nay
        const totalOrdersToday = orders.filter(order =>
            order.createdAt >= startOfToday && order.createdAt <= endOfToday
        ).length;

        // Tính số lượng đơn theo trạng thái
        const statusCounts: Record<string, number> = {};
        orders.forEach(order => {
            statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });

        const statuses = Object.entries(statusCounts).map(([name, value]) => ({
            name,
            value,
        }));

        return { statuses, totalOrdersToday };
    } catch (error) {
        console.error("Error fetching order statuses:", error);
        throw new Error("Failed to fetch order statuses");
    }
};

/**
 * Get pending orders
 * @returns List of pending orders with detailed information
 */
export const getPendingOrders = async (): Promise<PendingOrder[]> => {
    try {
        await connectDB();

        const pendingOrders = await Order.find({ status: "pending" }).sort({ createdAt: -1 });

        return pendingOrders.map(order => ({
            _id: order._id.toString(),
            table: order.table,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
        }));
    } catch (error) {
        console.error("Error fetching pending orders:", error);
        throw new Error("Failed to fetch pending orders");
    }
};
