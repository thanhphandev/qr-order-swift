"use client"

import React, {useState} from 'react';
import { OrderType } from '@/types/order';
import { Clock, PrinterIcon, User, FileEdit, ClipboardList, Calendar, Info, Truck, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { formatMoney, formatDate } from '@/lib/utils';
import { updateOrderStatus, deleteOrder } from '@/actions/order.action';
import { toast } from 'sonner';
import { OrderStatus } from '@/components/widgets/status-badge';

interface OrderDetailsProps {
  order: OrderType;
  onEdit?: () => void;
}

const OrderDetails = ({ order, onEdit }: OrderDetailsProps) => {
  const [status, setStatus] = useState(order.status);
  const acceptOrder = async() => {
    try {
      await updateOrderStatus(order._id, 'completed');
      setStatus('completed');
      toast.success('Đã xác nhận đơn hàng');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error('Error accepting order:', error);
    }
  }

  const markAsPaid = async() => {
    try {
      await updateOrderStatus(order._id, 'paid');
      setStatus('paid');
      toast.success('Đã xác nhận thanh toán');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error('Error marking order as paid:', error);
    }
  }

  const rejectOrder = async() => {
    try {
      await updateOrderStatus(order._id, 'deny');
      setStatus('deny');
      toast.success('Đã từ chối đơn hàng');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      console.error('Error accepting order:', error);
    }
  }
  const printInvoice = () => {
    toast.success('In hóa đơn');
  }
  return (
    <div className="bg-white rounded-xl shadow-sm mb-2">
      <div className="border-b border-gray-200">
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-orange-500 mb-2">Đơn hàng</h2>
            <div className="flex flex-col gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <CreditCard className="w-4 h-4 mr-1" />
                #{order._id}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Tạo: {formatDate(order.createdAt, {showTime: true})}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Cập nhật: {formatDate(order.updatedAt, {showTime: true})}
              </span>
              <span className="flex items-center">
                <OrderStatus status={status} />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors"
              >
                <FileEdit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </button>
            )}

            {printInvoice && (
              <button
                onClick={printInvoice}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors"
              >
                <PrinterIcon className="w-4 h-4 mr-1" />
                In hóa đơn
              </button>
            )}

            {status === 'completed' && (
              <button
                onClick={markAsPaid}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Xác nhận thanh toán
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Order Summary */}
        <div className="lg:col-span-8 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-gray-200">
          <div className="mb-6 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ClipboardList className="w-5 h-5 mr-2 text-orange-500" />
              Chi tiết đơn hàng
            </h2>
            <div className="bg-white rounded-xl p-4">
              <div className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <div key={index} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="mt-1 space-y-1">
                          {item.size && (
                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                          )}
                          {item.toppings && item.toppings.length > 0 && (
                            <div className="text-sm text-gray-500">
                              Toppings: {item.toppings.map((t) => (
                                <span key={t.name} className="inline-flex items-center bg-gray-100 rounded px-2 py-0.5 text-xs mr-1">
                                  {t.name} (+ {formatMoney(t.price)})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium text-gray-900">{formatMoney(item.price)}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4">
            <div className="flex justify-between items-center text-lg font-semibold text-gray-900">
              <span className="font-bold text-orange-500">Tổng đơn hàng</span>
              <span>{formatMoney(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="lg:col-span-4 p-4 sm:p-6">
          <div className="space-y-6">
            {/* Order Type & Table */}
            <div className='rounded-xl'>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-orange-500" />
                Thông tin đơn hàng
              </h2>
              <div className="space-y-4 bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-orange-500">Loại đơn</span>
                  <span className="text-sm text-gray-900 bg-white px-3 py-1 rounded-full">
                    {order.typeOrder === 'dine-in' ? 'Tại quán' : order.typeOrder === 'take-away' ? 'Mang về' : 'Giao hàng'}
                  </span>
                </div>
                {order.table && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Bàn</span>
                    <span className="text-sm text-gray-900 bg-white px-3 py-1 rounded-full">
                      {order.table}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            {order.customerInfo?.customerName !== undefined && (
              <div className='rounded-xl'>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-500" />
                  Thông tin khách hàng
                </h2>
                <div className="space-y-3 bg-white rounded-xl p-4">
                  {order.customerInfo.customerName && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-orange-500">Tên</span>
                      <span className="text-sm text-gray-900">{order.customerInfo.customerName}</span>
                    </div>
                  )}
                  {order.customerInfo.phoneNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-orange-500">SĐT</span>
                      <span className="text-sm text-gray-900">{order.customerInfo.phoneNumber}</span>
                    </div>
                  )}
                  {order.customerInfo.deliveryAddress && (
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-bold text-orange-500">Địa chỉ</span>
                      <span className="text-sm text-gray-900 text-right ml-4">{order.customerInfo.deliveryAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="rounded-xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-orange-500" />
                  Notes
                </h2>
                <div className="bg-white rounded-xl p-4">
                  <p className="text-sm text-gray-900">{order.notes}</p>
                </div>
              </div>
            )}
            
            {/* Actions */}
            {status === "pending" && (
              <div className="flex gap-3 justify-between items-center">
                <button
                  onClick={rejectOrder}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Từ chối đơn hàng
                </button>
                <button
                  onClick={acceptOrder}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Xác nhận đơn hàng
                </button>

              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;