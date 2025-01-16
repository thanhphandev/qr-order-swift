"use client"

import React, { useState, useCallback, useEffect } from 'react';
import CartButton from '@/components/cart/cart-button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProduct } from './cart-product';
import { useCartStore } from '@/stores/cart-store';
import { formatMoney } from '@/lib/utils';
import { toast } from 'sonner';
import { DiningOption } from '@/components/cart/option-button';
import { CreateOrderData, status, typeOrder } from "@/types/order";
import { createOrder, triggerOrder } from '@/actions/order.action';
import useOrdersStore from '@/stores/orders-store';

const CartView = ({ tables }: { tables: string[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableNumber, setTableNumber] = useState<string | null>(null);
    const [notes, setNotes] = useState<string>('');
    const [diningOption, setDiningOption] = useState<typeOrder>('dine-in');
    const [deliveryAddress, setDeliveryAddress] = useState<string>('');
    const [customerName, setCustomerName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const { cartProducts, updateQuantity, clearCart } = useCartStore();
    const { addOrder } = useOrdersStore();

    const subTotal = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const totalQuantity = cartProducts.reduce((sum, product) => sum + product.quantity, 0);

    const validatePhoneNumber = (phone: string) => {
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return phoneRegex.test(phone);
    };

    const validateDeliveryInfo = () => {
        if (!customerName.trim()) {
            toast.error('Vui lòng nhập tên người nhận');
            return false;
        }
        if (!phoneNumber.trim()) {
            toast.error('Vui lòng nhập số điện thoại');
            return false;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            toast.error('Số điện thoại không hợp lệ');
            return false;
        }
        if (!deliveryAddress.trim()) {
            toast.error('Vui lòng nhập địa chỉ giao hàng');
            return false;
        }
        return true;
    };

    const validateTakeAwayInfo = () => {
        if (!customerName.trim()) {
            toast.error('Vui lòng nhập tên người nhận');
            return false;
        }
        if (!phoneNumber.trim()) {
            toast.error('Vui lòng nhập số điện thoại');
            return false;
        }
        if (!validatePhoneNumber(phoneNumber)) {
            toast.error('Số điện thoại không hợp lệ');
            return false;
        }
        return true;
    };

    const handleClose = useCallback((e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setIsOpen(false);
        // Reset form
        setTableNumber(null);
        setNotes('');
        setDeliveryAddress('');
        setCustomerName('');
        setPhoneNumber('');
    }, []);

    const handleOrder = async () => {
        if (cartProducts.length === 0) {
            toast.error('Giỏ hàng trống');
            return;
        }

        // Validate based on dining option
        if (diningOption === 'dine-in' && !tableNumber) {
            toast.error('Vui lòng chọn số bàn');
            return;
        }

        if (diningOption === 'delivery' && !validateDeliveryInfo()) {
            return;
        }

        if (diningOption === 'take-away' && !validateTakeAwayInfo()) {
            return;
        }

        const orderData = {
            table: tableNumber || null,
            items: cartProducts.map((product) => ({
                _id: product._id,
                name: product.name,
                quantity: product.quantity,
                size: product.size,
                price: product.price,
                toppings: product.toppings?.map((topping) => (
                    {
                        name: topping.name,
                        price: topping.price,
                        quantity: topping.quantity
                    }
                )) || []
            })),
            status: 'pending' as status,
            typeOrder: diningOption,
            totalAmount: subTotal,
            notes: notes,
            customerInfo: diningOption !== 'dine-in' ? {
                name: customerName || null,
                phone: phoneNumber || null,
                address: diningOption === 'delivery' ? deliveryAddress || '' : ''
            } : null
        };
        try {
            const order = await createOrder(orderData);
            if (order) {
                await triggerOrder(order);
                addOrder(order);
            }
           
            toast.success('Đã đặt món thành công! cám ơn quý khách');
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Đặt món thất bại');
            return;
        }

        handleClose();
        clearCart();
    };

    if (!isOpen) {
        return <CartButton itemCount={totalQuantity} onClick={() => setIsOpen(true)} />;
    }

    const renderCustomerInfoFields = () => (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 border-b space-y-4"
        >
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                    Tên người nhận *
                </label>
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Nhập tên người nhận"
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                    Số điện thoại *
                </label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Nhập số điện thoại"
                />
            </div>
        </motion.div>
    );

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white p-4 border-b z-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Giỏ hàng</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleClose}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Dining Options */}
                        <div className="p-4 border-b">
                            <div className="flex gap-3">
                                <DiningOption
                                    label="Ăn tại quán"
                                    selected={diningOption === 'dine-in'}
                                    onClick={() => {
                                        setDiningOption('dine-in');
                                        setCustomerName('');
                                        setPhoneNumber('');
                                        setDeliveryAddress('');
                                    }}
                                />
                                <DiningOption
                                    label="Mang về"
                                    selected={diningOption === 'take-away'}
                                    onClick={() => {
                                        setDiningOption('take-away');
                                        setTableNumber(null);
                                        setDeliveryAddress('');
                                    }}
                                />
                                <DiningOption
                                    label="Giao hàng"
                                    selected={diningOption === 'delivery'}
                                    onClick={() => {
                                        setDiningOption("delivery");
                                        setTableNumber(null);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="p-4 space-y-2">
                            <AnimatePresence mode="popLayout">
                                {cartProducts.map((product, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <CartProduct product={product} onUpdateQuantity={updateQuantity} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {cartProducts.length === 0 && (
                                <div className="text-center py-8 text-gray-500">Giỏ hàng trống</div>
                            )}
                        </div>

                        {/* Dynamic Form Fields based on Option */}
                        <AnimatePresence>
                            {cartProducts.length > 0 && (
                                <>
                                    {/* Dine-in Option */}
                                    {diningOption === 'dine-in' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 border-b">
                                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                                    Số bàn *
                                                </label>
                                                <select
                                                    value={tableNumber || ''}
                                                    onChange={(e) => setTableNumber(e.target.value)}
                                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                >
                                                    <option value="" disabled>
                                                        Chọn số bàn
                                                    </option>
                                                    {tables.map((table) => (
                                                        <option key={table} value={table}>
                                                            {table}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Take-away Option */}
                                    {diningOption === 'take-away' && renderCustomerInfoFields()}

                                    {/* Delivery Option */}
                                    {diningOption === 'delivery' && (
                                        <>
                                            {renderCustomerInfoFields()}
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="p-4 border-b"
                                            >
                                                <label className="text-sm font-medium text-gray-700 block mb-2">
                                                    Địa chỉ giao hàng *
                                                </label>
                                                <textarea
                                                    value={deliveryAddress}
                                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                                    placeholder="Nhập địa chỉ giao hàng"
                                                    className="w-full p-2 border rounded-lg h-20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                                />
                                            </motion.div>
                                        </>
                                    )}

                                    {/* Notes Field */}
                                    <div className="p-4 border-b">
                                        <label className="text-sm font-medium text-gray-700 block mb-2">
                                            Ghi chú
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Ghi chú thêm về đơn hàng..."
                                            className="w-full p-2 border rounded-lg h-20 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* Payment Section */}
                        {cartProducts.length > 0 && (
                            <div className="sticky bottom-0 bg-white p-4 border-t">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-bold">Tổng đơn hàng</span>
                                    <span className="font-bold">
                                        {formatMoney(subTotal)}
                                    </span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                                    onClick={handleOrder}
                                >
                                    Đặt món
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CartView;