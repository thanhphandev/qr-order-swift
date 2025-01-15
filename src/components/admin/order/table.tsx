"use client"

import React from 'react';
import type { typeOrder } from '@/types/order';
import { UtensilsCrossed, Clock, Truck, DoorOpen } from 'lucide-react';
import { formatDate, relativeDate } from '@/lib/utils';
import Link from 'next/link';

interface TableProps {
    table?: string;
    orderType: typeOrder;
    orderId: string;
    createAt: Date;
    status: string;
}

const Table = ({ table, orderType, orderId, createAt, status }: TableProps) => {
    const getOrderTypeIcon = (type: typeOrder) => {
        switch (type) {
          case 'dine-in':
            return <UtensilsCrossed className="text-orange-500 h-5 w-5" />;
          case 'take-away':
            return <DoorOpen className="text-orange-500  h-5 w-5" />;
          case 'delivery':
            return <Truck className="text-orange-500  h-5 w-5" />;
        }
      };
    return (
        <Link href={`/admin/orders/current/${orderId}`}>
            <div className="p-5 bg-white rounded-xl shadow-md">
                <div className='flex items-center justify-center space-x-2'>
                    {getOrderTypeIcon(orderType)}
                    <p className='font-bold text-center text-orange-500'>{orderType === "dine-in"
                        ? "Tại quán"
                        : orderType === "take-away"
                            ? "Mang về"
                            : "Giao hàng"}</p>
                </div>
                  
                {table && (
                    <div className='flex items-center justify-between'>
                        <span className='text-sm font-bold'>Bàn</span>
                        <span className='text-sm bg-white px-3 py-1 rounded-full'>{table}</span>
                    </div>
                )}
                <div className='flex items-center justify-between'>
                    <span className='text-sm font-bold'>Trạng thái</span>
                    <span className='text-sm bg-white px-3 py-1 rounded-full'>{status === 'pending'
                        ? 'Chờ'
                        : status === 'completed'
                            ? 'Đã xác nhận'
                            : 'Đã thanh toán'}</span>
                </div>
                <div className="flex items-center justify-between space-x-2 text-gray-600">
                    Giờ vào:
                    <span className="text-sm">{formatDate(new Date(createAt), { onlyTime: true })}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{relativeDate(new Date(createAt))}</span>
                </div>

            </div>
        </Link>
    );
};

export default Table;