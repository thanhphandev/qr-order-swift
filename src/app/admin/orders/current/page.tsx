"use client";
import React, { useState, useEffect } from 'react';
import Table from '@/components/admin/order/table';
import { getOrders } from '@/actions/order.action';
import { OrderType } from '@/types/order';
import { pusherClient } from '@/lib/pusher';
import NoOrdersFound from '@/components/widgets/not-order';
import Loading from '@/components/widgets/loading-product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Page = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'dine-in' | 'take-away' | 'delivery'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getOrders();
        setOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Unable to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const handleNewOrder = ({ order }: { order: OrderType }) => {
      setOrders(prevOrders => [order, ...prevOrders]);
    };

    fetchOrders();

    pusherClient.subscribe('orders');
    pusherClient.bind('new-order', handleNewOrder);

    // Cleanup
    return () => {
      pusherClient.unbind('new-order', handleNewOrder);
      pusherClient.unsubscribe('orders');
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  const currentOrders = orders.filter(order =>
    (order.status === 'pending' || order.status === 'completed') &&
    (filter === 'all' || order.typeOrder === filter)
  );

  return (
    <Tabs
      defaultValue={filter}
      className="space-y-6"
      onValueChange={(value) => setFilter(value as typeof filter)}
    >
      <TabsList className="bg-orange-50">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
        >
          Tất cả
        </TabsTrigger>
        <TabsTrigger
          value="dine-in"
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
        >
          Ăn tại quán
        </TabsTrigger>
        <TabsTrigger
          value="take-away"
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
        >
          Mang về
        </TabsTrigger>
        <TabsTrigger
          value="delivery"
          className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
        >
          Giao hàng
        </TabsTrigger>
      </TabsList>

      <TabsContent value={filter} className="space-y-6">
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
      </TabsContent>
    </Tabs>
  );
};

export default Page;