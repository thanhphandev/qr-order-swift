"use client"

import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, User, FileText, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { OrderType, status as StatusType } from '@/types/order';
import { formatDate, formatMoney } from '@/lib/utils';
import { OrderStatus } from '@/components/widgets/status-badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import useOrdersStore from '@/stores/orders-store';
import { pusherClient } from '@/lib/pusher';

interface OrderDetailsProps {
    order: OrderType;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasCustomerInfo = order.customerInfo && Object.keys(order.customerInfo).length > 0;
    const { updateOrderStatus } = useOrdersStore();

    useEffect(() => {
        const handleOrderStatusUpdate = ({ orderId, status }: { orderId: string; status: StatusType }) => {
            updateOrderStatus(orderId, status);
        };

        pusherClient.subscribe('orders');
        pusherClient.bind('order-status', handleOrderStatusUpdate);

        return () => {
            pusherClient.unbind('order-status', handleOrderStatusUpdate);
            pusherClient.unsubscribe('orders');
        };
    }, [updateOrderStatus]);


    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <Card className="w-full max-w-4xl mx-auto mb-4 hover:shadow-lg transition-shadow duration-200">
            {/* Order Summary - Always Visible */}
            <CardHeader
                className="cursor-pointer"
                onClick={toggleExpand}
            >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Đơn hàng
                            </h2>

                            <OrderStatus status={order.status} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-gray-600">
                            <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {formatDate(order.createdAt, { showTime: true })}
                            </span>
                            <span className="hidden sm:block">•</span>
                            <span className="font-medium text-orange-500">
                                {order.typeOrder === 'dine-in' ? 'Dùng tại chỗ' :
                                    order.typeOrder === 'take-away' ? 'Mang đi' : 'Giao hàng'}
                            </span>
                            <p className='text-sm'>Mã đơn: {order._id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Tổng tiền</p>
                            <p className="font-bold text-lg text-gray-900">{formatMoney(order.totalAmount)}</p>
                        </div>
                        {isExpanded ?
                            <ChevronUp className="w-6 h-6 text-gray-400" /> :
                            <ChevronDown className="w-6 h-6 text-gray-400" />
                        }
                    </div>
                </div>
            </CardHeader>

            {/* Expandable Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <CardContent className="border-t">
                            {/* Customer Info */}
                            {hasCustomerInfo && (
                                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {order.customerInfo?.customerName && (
                                            <div className="flex items-center space-x-2">
                                                <User className="w-4 h-4 text-gray-500" />
                                                <span>{order.customerInfo.customerName}</span>
                                            </div>
                                        )}
                                        {order.customerInfo?.phoneNumber && (
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <span>{order.customerInfo.phoneNumber}</span>
                                            </div>
                                        )}
                                        {order.customerInfo?.deliveryAddress && (
                                            <div className="flex items-center space-x-2 col-span-full">
                                                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                <span className="text-sm">{order.customerInfo.deliveryAddress}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div className="space-y-4 pt-3">
                                <h3 className="font-semibold text-gray-900">Chi tiết đơn hàng</h3>
                                <div className="grid gap-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex flex-col sm:flex-row justify-between gap-2">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <span>Số lượng: {item.quantity}</span>
                                                        {item.size && (
                                                            <>
                                                                <span>•</span>
                                                                <span>Size: {item.size}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-medium text-gray-900">
                                                        {formatMoney(item.price)}
                                                    </span>
                                                </div>
                                            </div>
                                            {item.toppings && item.toppings.length > 0 && (
                                                <div className="mt-2 pl-4 border-l-2 border-gray-200">
                                                    <p className="text-sm text-gray-600 mb-1">Toppings:</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                                        {item.toppings.map((topping, idx) => (
                                                            <div key={idx} className="text-sm text-gray-600 flex justify-between">
                                                                <span>{topping.name} (x{topping.quantity})</span>
                                                                <span>{formatMoney(topping.price)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            {order.notes && (
                                <div className="mt-6 flex items-start space-x-2 bg-yellow-50 p-4 rounded-lg">
                                    <FileText className="w-5 h-5 text-yellow-600" />
                                    <div>
                                        <p className="font-medium text-gray-900">Ghi chú</p>
                                        <p className="text-gray-600">{order.notes}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
};

export default OrderDetails;