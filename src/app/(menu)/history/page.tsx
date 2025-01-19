"use client"

import React, { useEffect, useState } from 'react';
import { OrderType } from '@/types/order';
import useOrdersStore from '@/stores/orders-store';
import OrderDetails from '@/components/menu/orders-history';
import NoOrdersFound from '@/components/widgets/not-order';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Page = () => {
    const { orders } = useOrdersStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState<OrderType[]>(orders);
    const router = useRouter();

    useEffect(() => {
        const filtered = orders.filter(order => 
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.customerInfo?.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.customerInfo?.phoneNumber || '').includes(searchTerm)
        );
        setFilteredOrders(filtered);
    }, [orders, searchTerm]);

    return (
        <div className="container mx-auto px-4 py-6">
            <button className='px-4 py-2 bg-orange-500 rounded-xl text-white' onClick={() => router.push("/menu")}>Quay lại</button>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-orange-500 mb-4">Lịch sử đơn hàng</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm theo mã đơn, tên khách hàng hoặc số điện thoại..."
                            className="pl-10 w-full rounded-xl border-orange-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <OrderDetails key={order._id} order={order} />
                        ))
                    ) : (
                        <NoOrdersFound />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;