"use client"
import React from 'react';
import type { typeOrder } from '@/types/order';
import { UtensilsCrossed, Clock, Truck, DoorOpen, CheckCircle2, Timer, CreditCard } from 'lucide-react';
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
        return <DoorOpen className="text-orange-500 h-5 w-5" />;
      case 'delivery':
        return <Truck className="text-orange-500 h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Timer className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'completed':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <Link href={`/admin/orders/current/${orderId}`}>
      <div className="p-5 bg-white rounded-xl shadow-md">
        <div className="flex items-center justify-center space-x-2">
          {getOrderTypeIcon(orderType)}
          <p className="font-bold text-center text-orange-500">
            {orderType === "dine-in"
              ? "Tại quán"
              : orderType === "take-away"
                ? "Mang về"
                : "Giao hàng"}
          </p>
        </div>
        
        {table && (
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm font-bold">Bàn</span>
            <span className="text-sm bg-white px-3 py-1 rounded-full">{table}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm font-bold">Trạng thái</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <span className={`text-sm ${getStatusColor(status)}`}>
              {status === 'pending'
                ? 'Chờ'
                : status === 'completed'
                  ? 'Đã xác nhận'
                  : 'Đã thanh toán'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2 text-gray-600 mt-3">
          Giờ vào:
          <span className="text-sm">
            {formatDate(new Date(createAt), { onlyTime: true })}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600 mt-2">
          <Clock className="h-4 w-4 text-orange-500" />
          <span className="text-sm">{relativeDate(new Date(createAt))}</span>
        </div>
      </div>
    </Link>
  );
};

export default Table;