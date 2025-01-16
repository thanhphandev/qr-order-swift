import React from 'react'
import { Clock, MapPin, Phone, User, Utensils, Package, Truck, FileText, DollarSign } from 'lucide-react';
import { OrderType, status, typeOrder } from '@/types/order';
import { formatDate, formatMoney } from '@/lib/utils';


interface OrderDetailsProps {
    order: OrderType;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
    console.log(order);
    return (

        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
                            <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>
                    {order.table && <div className="flex items-center mt-2">
                        <span className="text-orange-500 font-bold">Bàn số: {order.table}</span>
                    </div>}
                </div>

                {/* Order Info */}
                <div className="p-6 space-y-6">
                    {/* Order Type & Time */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <OrderTypeIcon type={order.typeOrder} />
                            <span className="text-gray-700 capitalize">{order.typeOrder}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(order.createdAt, { showTime: true })}</span>
                        </div>
                    </div>

                    {/* Customer Info */}
                    {order.customerInfo && (
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <h2 className="font-semibold text-gray-900">Thông tin khách hàng</h2>
                            <div className="space-y-2">
                                {order.customerInfo?.customerName && (
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <User className="w-4 h-4" />
                                        <span>{order.customerInfo?.customerName}</span>
                                    </div>
                                )}
                                {order.customerInfo?.phoneNumber && (
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{order.customerInfo?.phoneNumber}</span>
                                    </div>
                                )}
                                {order.customerInfo?.deliveryAddress && (
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span>{order.customerInfo?.deliveryAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div>
                        <h2 className="font-semibold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            {item.size && (
                                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                                            )}
                                            <p className="text-sm text-gray-500">số lượng: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-gray-900">{formatMoney(item.price)}</p>
                                    </div>
                                    {item.toppings && item.toppings.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">Toppings:</p>
                                            {item.toppings.map((topping, index) => (
                                                <p key={index} className="text-sm text-gray-600">
                                                    {topping.name} (x{topping.quantity}) - {formatMoney(topping.price)}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                        <div className="flex items-start space-x-2">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-700">Notes</p>
                                <p className="text-gray-600">{order.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Total */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-5 h-5 text-gray-400" />
                                <span className="font-medium text-gray-900">Tổng đơn hàng</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                {formatMoney(order.totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default OrderDetails

const StatusBadge = ({ status }: { status: status }) => {
    const getStatusColor = () => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'paid':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const OrderTypeIcon = ({ type }: { type: typeOrder }) => {
    switch (type) {
        case 'dine-in':
            return <Utensils className="w-5 h-5" />;
        case 'take-away':
            return <Package className="w-5 h-5" />;
        case 'delivery':
            return <Truck className="w-5 h-5" />;
    }
};
