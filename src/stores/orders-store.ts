import { OrderType } from '@/types/order';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrdersStore {
    orders: OrderType[];
    addOrder: (order: OrderType) => void;
    deleteOrder: (orderId: string) => void;
}

const useOrdersStore = create<OrdersStore>()(
    persist(
        (set) => ({
            orders: [],

            addOrder: (order) => {
                console.log('Adding order:', order);
                set((state) => ({
                    orders: [...state.orders, order]
                }));
            },

            deleteOrder: (orderId) => {
                set((state) => ({
                    orders: state.orders.filter((order) => order._id !== orderId)
                }));
            }
        }),
        {
            name: 'orders',
        }
    )
)

export default useOrdersStore;
