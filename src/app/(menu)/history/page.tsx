"use client";

import React, { useEffect, useState } from 'react';
import { OrderType } from '@/types/order';
import useOrdersStore from '@/stores/orders-store';
import OrderDetails from '@/components/menu/orders-history';
import NoOrdersFound from '@/components/widgets/not-order';

const Page = () => {
    const { orders } = useOrdersStore();
    const [ordersHistory, setOrdersHistory] = useState<OrderType[]>(orders);

    useEffect(() => {
        setOrdersHistory(orders);
    }, [orders]);

    return (
        <div className='flex flex-col items-center gap-2'>
            {ordersHistory.length > 0 ? (
                ordersHistory.map((order) => (
                    <OrderDetails key={order._id} order={order} />
                ))
            ) : (
                <NoOrdersFound />
            )}
        </div>
    );
};

export default Page;
