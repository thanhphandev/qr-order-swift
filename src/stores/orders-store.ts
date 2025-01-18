import { OrderType, status } from '@/types/order';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrdersStore {
    orders: OrderType[];
    addOrder: (order: OrderType) => void;
    deleteOrder: (orderId: string) => void;
    updateOrderStatus: (orderId: string, status: status) => void;
}

const useOrdersStore = create<OrdersStore>()(
    persist(
        (set) => ({
            orders: [],

            addOrder: (order) => {
                set((state) => ({
                    orders: [order, ...state.orders]
                }));
            },

            deleteOrder: (orderId) => {
                set((state) => ({
                    orders: state.orders.filter((order) => order._id !== orderId)
                }));
            },

            updateOrderStatus: (orderId, newStatus) => {
                set((state) => ({
                    orders: state.orders.map((order) =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                }));
            },
        }),
        {
            name: 'orders',
        }
    )
);

export default useOrdersStore;
