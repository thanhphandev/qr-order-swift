"use client";

import Table from '@/components/admin/order/table';
import { getOrders } from '@/actions/order.action';
import React, { useEffect, useState } from 'react';
import { OrderType } from '@/types/order';
import { pusherClient } from '@/lib/pusher';
import NoOrdersFound from '@/components/widgets/not-order';
import Loading from '@/components/widgets/loading-product';

const Page = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getOrders();
        setOrders(ordersData); // Add latest orders to the top
        setError(null);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Unable to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    pusherClient.subscribe('orders');
    const handleNewOrder = ({ order }: { order: OrderType }) => {
      setOrders((prevOrders) => [order, ...prevOrders]); // Add new orders to the top
    };
    pusherClient.bind('new-order', handleNewOrder);

    fetchOrders();

    return () => {
      pusherClient.unbind('new-order', handleNewOrder);
      pusherClient.unsubscribe('orders');
    };
  }, []);

  // Filter pending orders
  const currentOrders = orders.filter((order) => order.status === 'pending' || order.status === 'completed');

  // Render loading state
  if (loading) {
    return <Loading />;
  }

  // Render error state
  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  // Render orders or "No Orders Found"
  return (
    <>
      {currentOrders.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {currentOrders.map((order) => (
            <Table
              key={order._id}
              table={order.table}
              orderType={order.typeOrder}
              orderId={order._id}
              createAt={order.createdAt}
              status={order.status}
            />
          ))}
        </div>
      ) : (
        <NoOrdersFound />
      )}
    </>
  );
};

export default Page;
