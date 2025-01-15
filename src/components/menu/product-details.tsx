"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Minus, Share2, Heart, ArrowLeft,
  ShoppingCart, Check, Loader2, Info
} from "lucide-react";
import { MenuItemType } from "@/types/menu-item";
import Image from "next/image";
import { formatMoney } from '@/lib/utils';
import { useFavoriteProductStore } from "@/stores/favorite-product";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { useCartStore } from "@/stores/cart-store";
import { CartProductType } from "@/types/cart-product";

interface ProductDetailsProps {
  product: MenuItemType;
}

export default function ProductDetail({ product }: ProductDetailsProps) {

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.pricePerSize?.[0]?.size || null
  );
  const [selectedToppings, setSelectedToppings] = useState<{ name: string; price: number; quantity: number }[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { favoriteProducts, removeFavoriteProduct, addFavoriteProduct } = useFavoriteProductStore();
  const [isProductFavorite, setIsProductFavorite] = useState(false);
  const router = useRouter();
  const { addToCart } = useCartStore();

  // Tính toán giá
  const basePrice =
    product.pricePerSize?.find((size) => size.size === selectedSize)?.price ||
    product.price;
    const toppingsPrice = selectedToppings.reduce((total, topping) => {
      const toppingData = product.toppings?.find((t) => t.name === topping.name);
      return total + (toppingData?.price || 0) * topping.quantity;
    }, 0);
    
  const totalPrice = (basePrice + toppingsPrice) * quantity;
  
  const toggleFavorite = () => {
    if (favoriteProducts.some(p => p._id === product._id)) {
      removeFavoriteProduct(product._id);
    } else {
      addFavoriteProduct(product);
    }
  };

  useEffect(() => {
    setIsProductFavorite(favoriteProducts.some((p) => p._id === product._id));
  }, [favoriteProducts, product._id]);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    setIsAddingToCart(true);

    const itemToAdd: CartProductType = {
      _id: product._id,
      name: product.name,
      quantity: 1,
      size: selectedSize || product.pricePerSize?.[0]?.size,
      toppings: selectedToppings,
      price: totalPrice || product.price,
      image: product.image,
    };
    addToCart(itemToAdd);
    toast.success('Đã thêm một món vào giỏ hàng');
    resetSelection();
    setIsAddingToCart(false);
  };

  const resetSelection = () => {
    setSelectedSize(product.pricePerSize?.[0]?.size || null);
    setSelectedToppings([]);
    setQuantity(1);
  }

  const handleShare = async () => {
    const url = window.location.href;

    // Kiểm tra hỗ trợ chia sẻ
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Xem ngay: ${product.name}`,
          text: `
          Sản phẩm: ${product.name}
          Mô tả: ${product.description}
          Giá: ${formatMoney(product.price)}
          `,
          url,
        });
        toast.success('Đã chia sẻ thành công!');
      } catch (error: any) {
        if (error.name === 'AbortError') {
          // Người dùng đã hủy chia sẻ, không hiển thị lỗi
          toast.error('Bạn đã hủy chia sẻ.');
          return
        }
        console.error('Chia sẻ thất bại:', error);
        toast.error('Chia sẻ thất bại, vui lòng thử lại!');
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('URL đã được sao chép vào clipboard!');
      } catch (error) {
        console.error('Sao chép URL thất bại:', error);
        toast.error('Trình duyệt không hỗ trợ sao chép URL!');
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button onClick={() => router.back()} className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative">
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                priority
                className="w-full h-[300px] md:h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => toggleFavorite()}
                  className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${isProductFavorite ? "text-red-500 fill-red-500" : "text-gray-600"}`}
                  />
                </button>
                <button onClick={handleShare} className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col">
              {/* Tags & Title */}
              <div className="space-y-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Size Selection */}
              {product.pricePerSize && product.pricePerSize?.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h2 className="text-lg font-semibold">Chọn kích cỡ</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {product.pricePerSize.map((size) => (
                      <button
                        key={size.size}
                        onClick={() => setSelectedSize(size.size)}
                        className={`p-3 rounded-xl text-left transition ${selectedSize === size.size
                          ? "bg-orange-50 border-2 border-orange-500"
                          : "border-2 border-gray-200 hover:border-orange-200"
                          }`}
                      >
                        <div className="font-medium">{size.size}</div>
                        <div className="text-orange-600 font-semibold">
                          {formatMoney(size.price)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.toppings && product.toppings?.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h2 className="text-lg font-semibold">Topping thêm</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.toppings?.map((topping) => {
                      const selectedTopping = selectedToppings.find((t) => t.name === topping.name);
                      const quantity = selectedTopping?.quantity || 0;

                      return (
                        <div
                          key={topping.name}
                          className={`flex items-center p-4 rounded-xl border-2 transition ${quantity > 0
                            ? "bg-orange-50 border-orange-500"
                            : "border-gray-200 hover:border-orange-200"
                            }`}
                        >
                          <span className="flex-1">{topping.name}</span>
                          <span className="text-orange-600 font-medium">
                            + {formatMoney(topping.price)}
                          </span>
                          <div className="flex items-center ml-4">
                            <button
                              onClick={() => {
                                if (quantity > 0) {
                                  setSelectedToppings((prev) =>
                                    prev
                                      .map((t) =>
                                        t.name === topping.name
                                          ? { ...t, quantity: t.quantity - 1 }
                                          : t
                                      )
                                      .filter((t) => t.quantity > 0)
                                  );
                                }
                              }}
                              className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="mx-2">{quantity}</span>
                            <button
                              onClick={() => {
                                setSelectedToppings((prev) => {
                                  const existing = prev.find((t) => t.name === topping.name);
                                  if (existing) {
                                    return prev.map((t) =>
                                      t.name === topping.name
                                        ? { ...t, quantity: t.quantity + 1 }
                                        : t
                                    );
                                  }
                                  return [...prev, { name: topping.name, price: topping.price, quantity: 1 }];
                                });
                              }}
                              className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}


              {/* Quantity and Add to Cart */}
              <div className="mt-auto pt-6 border-t">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Tổng tiền</div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatMoney(totalPrice)}
                    </div>
                  </div>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:text-orange-500 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:text-orange-500 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 
                           text-white rounded-xl py-3 px-4 font-semibold flex items-center 
                           justify-center transition-colors"
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Thêm vào giỏ hàng
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
