import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartProductType } from '@/types/cart-product';

interface CartStore {
    cartProducts: CartProductType[];
    addToCart: (product: CartProductType) => void;
    updateQuantity: (uniqueId: string, quantity: number) => void;
    clearCart: () => void;
}

// Tạo uniqueId cho sản phẩm dựa trên name, size và toppings
export function generateUniqueId(product: CartProductType): string {
    const toppingsString = product.toppings
        ? product.toppings.map((t) => `${t.name}-${t.quantity}-${t.price}`).join('|')
        : '';
    return `${product.name}-${product.size || 'no-size'}-${toppingsString}`;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set) => ({
            cartProducts: [],

            addToCart: (product) => {
                set((state) => {
                    const uniqueId = generateUniqueId(product);
                    const existing = state.cartProducts.find((item) => generateUniqueId(item) === uniqueId);

                    if (existing) {
                        return {
                            cartProducts: state.cartProducts.map((item) =>
                                generateUniqueId(item) === uniqueId
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }

                    return {
                        cartProducts: [...state.cartProducts, { ...product, quantity: 1 }],
                    };
                });
            },

            updateQuantity: (uniqueId, quantity) => {
                set((state) => ({
                    cartProducts:
                        quantity === 0
                            ? state.cartProducts.filter((item) => generateUniqueId(item) !== uniqueId)
                            : state.cartProducts.map((item) =>
                                  generateUniqueId(item) === uniqueId
                                      ? { ...item, quantity }
                                      : item
                              ),
                }));
            },

            clearCart: () => set({ cartProducts: [] }),
        }),
        {
            name: 'cart-products',
        }
    )
);
