import OrderDetails from '@/components/admin/order/order-details';
import { getOrderById } from '@/actions/order.action';
import { notFound } from 'next/navigation';
import React from 'react'

const OrderDetailsPage = async ({ params }: { params: Promise<{ order: string }> }) => {
    const orderId = (await params).order;
    const orderDetails = await getOrderById(orderId);

    if(!orderDetails) {
        notFound()
    }
   
    return (
        <div>
            {orderDetails && <OrderDetails order={orderDetails}/>}
        </div>
    )
}

export default OrderDetailsPage