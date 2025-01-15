"use client"

import React, { useState } from 'react';
import {
  Plus, Minus, Share2, Heart, ArrowLeft,
  ShoppingCart, Check, Loader2, Info
} from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho sản phẩm demo
const DEMO_PRODUCT = {
  id: '1',
  name: 'Signature Pepperoni Pizza',
  description: 'Our classic pepperoni pizza features a perfect blend of premium mozzarella cheese and high-quality pepperoni slices on our house-made tomato sauce and hand-tossed crust.',
  sizes: [
    { id: 'small', name: 'Small', price: 12.99, serves: '1-2' },
    { id: 'medium', name: 'Medium', price: 16.99, serves: '2-3' },
    { id: 'large', name: 'Large', price: 20.99, serves: '3-4' }
  ],
  toppings: [
    { id: 'cheese', name: 'Extra Cheese', price: 2.00 },
    { id: 'mushrooms', name: 'Mushrooms', price: 1.50 },
    { id: 'peppers', name: 'Bell Peppers', price: 1.00 },
    { id: 'onions', name: 'Onions', price: 1.00 }
  ],
  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Pizza_Vi%E1%BB%87t_Nam_%C4%91%E1%BA%BF_d%C3%A0y%2C_x%C3%BAc_x%C3%ADch_%28SNaT_2018%29_%287%29.jpg/640px-Pizza_Vi%E1%BB%87t_Nam_%C4%91%E1%BA%BF_d%C3%A0y%2C_x%C3%BAc_x%C3%ADch_%28SNaT_2018%29_%287%29.jpg',
  tags: ['Best Seller', 'Classic Pizza']
};

export default function ProductDetail() {
  // State management
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(DEMO_PRODUCT.sizes[1].id);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Tính toán giá
  const basePrice = DEMO_PRODUCT.sizes.find(size => size.id === selectedSize).price;
  const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
    const topping = DEMO_PRODUCT.toppings.find(t => t.id === toppingId);
    return total + (topping?.price || 0);
  }, 0);
  const totalPrice = (basePrice + toppingsPrice) * quantity;

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button className="inline-flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
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
              <img
                src={DEMO_PRODUCT.image}
                alt={DEMO_PRODUCT.name}
                className="w-full h-[300px] md:h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
                <button className="p-2 bg-white/90 rounded-full shadow hover:bg-white transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col">
              {/* Tags & Title */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-wrap gap-2">
                  {DEMO_PRODUCT.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{DEMO_PRODUCT.name}</h1>
                <p className="text-gray-600">{DEMO_PRODUCT.description}</p>
              </div>

              {/* Size Selection */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Chọn kích cỡ</h2>
                  <span className="text-sm text-gray-500 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    Khuyến nghị: Size Medium
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {DEMO_PRODUCT.sizes.map(size => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`p-3 rounded-xl text-left transition ${
                        selectedSize === size.id
                          ? 'bg-orange-50 border-2 border-orange-500'
                          : 'border-2 border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <div className="font-medium">{size.name}</div>
                      <div className="text-orange-600 font-semibold">${size.price}</div>
                      <div className="text-sm text-gray-500">{size.serves} người</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings */}
              <div className="space-y-4 mb-6">
                <h2 className="text-lg font-semibold">Topping thêm</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DEMO_PRODUCT.toppings.map(topping => (
                    <label
                      key={topping.id}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition ${
                        selectedToppings.includes(topping.id)
                          ? 'bg-orange-50 border-2 border-orange-500'
                          : 'border-2 border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedToppings.includes(topping.id)}
                        onChange={(e) => {
                          setSelectedToppings(e.target.checked
                            ? [...selectedToppings, topping.id]
                            : selectedToppings.filter(id => id !== topping.id)
                          );
                        }}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="ml-3 flex-1">{topping.name}</span>
                      <span className="text-orange-600 font-medium">+${topping.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="mt-auto pt-6 border-t">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Tổng tiền</div>
                    <div className="text-3xl font-bold text-gray-900">${totalPrice.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center border-2 border-gray-200 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:text-orange-500 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
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

      {/* Notification */}
      <div
        className={`fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-xl
                   shadow-lg transform transition-transform duration-300 flex items-center
                   ${showNotification ? 'translate-y-0' : 'translate-y-24'}`}
      >
        <Check className="w-5 h-5 mr-2" />
        Đã thêm vào giỏ hàng!
      </div>
    </div>
  );
}