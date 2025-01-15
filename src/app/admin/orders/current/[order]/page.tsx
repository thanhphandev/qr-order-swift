import OrderDetails from '@/components/admin/order/order-details';
import NotFoundPage from '@/components/widgets/not-found';
import { getOrderById } from '@/actions/order.action';
import React from 'react'

const OrderDetailsPage = async ({ params }: { params: Promise<{ order: string }> }) => {
    const orderId = (await params).order;
    const orderDetails = await getOrderById(orderId);
    if(!orderDetails) {
        <NotFoundPage />
    }
   
    return (
        <div>
            {orderDetails && <OrderDetails order={orderDetails}/>}
        </div>
    )
}

export default OrderDetailsPage