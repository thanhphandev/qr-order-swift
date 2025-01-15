import React from 'react';
import { Minus, Plus } from 'lucide-react';
import type { CartProductType } from '@/types/cart-product';
import { formatMoney } from '@/lib/utils';
import Image from 'next/image';
import { generateUniqueId } from '@/stores/cart-store';

interface CartProductProps {
    product: CartProductType;
    onUpdateQuantity: (uniqueId: string, quantity: number) => void;
}

export function CartProduct({ product, onUpdateQuantity }: CartProductProps) {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="rounded-lg h-12 w-12 object-cover"
                    quality={100}
                    priority
                />

                <div className="flex flex-col">
                    <h3 className="font-bold text-orange-500">{product.name}</h3>
                    {product.size && <span className="text-sm text-gray-500">{product.size}</span>}
                    {product.toppings && product.toppings?.length > 0 &&
                        product.toppings?.map((topping) => (
                            <span key={topping.name} className="text-sm text-gray-500">
                                + {topping.name} x {topping.quantity}
                            </span>
                        ))} 
                    <p className="text-gray-600">
                        {formatMoney(product.price)} x {product.quantity}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onUpdateQuantity(generateUniqueId(product), product.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center text-sm">{product.quantity}</span>
                <button
                    onClick={() => onUpdateQuantity(generateUniqueId(product), product.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}