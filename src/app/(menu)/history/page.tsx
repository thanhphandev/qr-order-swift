"use client";

import React, { useEffect, useState } from 'react';
import { OrderType } from '@/types/order';
import useOrdersStore from '@/stores/orders-store';
import OrderDetails from '@/components/menu/orders-history';

const Page = () => {
    const { orders } = useOrdersStore();
    const [ordersHistory, setOrdersHistory] = useState<OrderType[]>(orders);

    useEffect(() => {
        setOrdersHistory(orders);
    }, [orders]);

    return (
        <div className='flex flex-col items-center gap-2 bg-gray-100'>
            {ordersHistory.length > 0 ? (
                ordersHistory.map((order) => (
                    <OrderDetails key={order._id} order={order} />
                ))
            ) : (
                "Bạn chưa có đơn hàng nào"
            )}
        </div>
    );
};

export default Page;
