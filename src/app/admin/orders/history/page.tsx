'use client';

import { getOrders } from '@/actions/order.action';
import OrderDetails from '@/components/admin/order/order-details';
import OrderFilter from '@/components/admin/order/order-filter';
import Loading from '@/components/widgets/loading-product';
import { OrderType } from '@/types/order';
import { useState, useEffect } from 'react';
import { Filters } from '@/types/order';

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleFilterChange = async (filters: Filters) => {
    try {
      setLoading(true);
      // Convert date strings to Date objects
      const formattedFilters = {
        ...filters,
        fromDate: filters.fromDate ? new Date(filters.fromDate) : undefined,
        toDate: filters.toDate ? new Date(filters.toDate) : undefined,
        status: filters.status ?? undefined,
        typeOrder: filters.typeOrder ?? undefined
      };
      
      const filteredOrders = await getOrders(formattedFilters);
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error filtering orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    alert('Edit order');
  }

  useEffect(() => {
    handleFilterChange({
      status: null,
      typeOrder: null,
      fromDate: "",
      toDate: ""
    });
  }, []);

  return (
    <div className="space-y-6">
      <OrderFilter onFilterChange={handleFilterChange} />
      
      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {orders.length > 0 && orders.map(order => (
            <OrderDetails onEdit={handleEdit} key={order._id} order={order} />
          ))}
          {orders.length === 0 && (
            <div className="text-center py-8">Không tìm thấy đơn hàng nào</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;