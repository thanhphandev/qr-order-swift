'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getOrders } from '@/actions/order.action';
import OrderDetails from '@/components/admin/order/order-details';
import OrderFilter from '@/components/admin/order/order-filter';
import Loading from '@/components/widgets/loading-product';
import { OrderType, Filters } from '@/types/order';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageSearch } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleFilterChange = useCallback(async (filters: Filters) => {
    try {
      setLoading(true);
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
  }, []);

  const handleEdit = useCallback(() => {
    alert('Edit order');
  }, []);

  useEffect(() => {
    handleFilterChange({
      status: null,
      typeOrder: null,
      fromDate: "",
      toDate: ""
    });
  }, [handleFilterChange]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-500 mt-1">Xem và quản lý tất cả đơn hàng</p>
      </div>

      <OrderFilter onFilterChange={handleFilterChange} isLoading={loading} />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loading />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            {orders.length > 0 ? (
              orders.map(order => (
                <OrderDetails
                  key={order._id}
                  order={order}
                  onEdit={handleEdit}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Không tìm thấy đơn hàng</h3>
                <p className="mt-2 text-gray-500">Thử thay đổi bộ lọc để tìm kiếm lại</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;