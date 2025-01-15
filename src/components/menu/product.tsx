'use client';

import Image from 'next/image';
import { Plus, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { MenuItemType } from '@/types/menu-item';
import { useCartStore } from '@/stores/cart-store';
import { useFavoriteProductStore } from '@/stores/favorite-product';
import { toast } from 'sonner';
import { formatMoney } from '@/lib/utils';
import Badge from '@/components/widgets/custom-badge';
import Link from 'next/link';

interface MenuItemProps {
  product: MenuItemType;
}

export const Product = ({ product }: MenuItemProps) => {
  const { favoriteProducts, removeFavoriteProduct, addFavoriteProduct } = useFavoriteProductStore();
  const { addToCart } = useCartStore();
  const [isProductFavorite, setIsProductFavorite] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.pricePerSize?.length ? product.pricePerSize[0].size : null
  );

  const [isLoading, setIsLoading] = useState(false);
  const [showDetailsButton, setShowDetailsButton] = useState(false);

  const currentPrice = product.pricePerSize?.length
    ? product.pricePerSize.find(p => p.size === selectedSize)?.price
    : product.price;

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

  const handleAddToCart = () => {
    setIsLoading(true);
    const itemToAdd = {
      _id: product._id,
      name: product.name,
      quantity: 1,
      size: selectedSize || product.pricePerSize?.[0]?.size,
      price: currentPrice || product.price,
      image: product.image,
    };
    addToCart(itemToAdd);
    toast.success('Đã thêm một món vào giỏ hàng');
    setIsLoading(false);
  };

  return (
    <div
      className="relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
    >
      <div className="relative w-full h-48 overflow-hidden" onMouseEnter={() => setShowDetailsButton(true)}
      onMouseLeave={() => setShowDetailsButton(false)}>
        <div className={`absolute inset-0 bg-gray-300 animate-pulse ${isLoading ? 'opacity-100' : 'opacity-0'}`} />
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setIsLoading(false)}
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isProductFavorite ? "text-red-500 fill-red-500" : "text-gray-500"}`}
          />
        </button>
        <div className="flex flex-col gap-1.5 absolute top-3 left-3">
          {product.isBestSeller && <Badge variant="best-seller" />}
          {product.isAvailable === false && <Badge variant="out-of-stock" />}
        </div>
        {showDetailsButton && (
          <Link href={`/products/${product.slug}`}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-orange-600 transition-all"
          >
            Xem chi tiết
          </Link>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center cursor-pointer">
          <h3 className="text-lg font-bold text-gray-800 truncate max-w-[70%]">{product.name}</h3>
          <span className="text-green-600 font-semibold text-base">{formatMoney(currentPrice || 0)}</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        {product.pricePerSize && product.pricePerSize.length > 0 && (
          <div className="flex gap-2">
            {product.pricePerSize.map(({ size, price }) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${
                  selectedSize === size
                    ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
        {product.isAvailable && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center ${
                isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
              } text-white px-4 py-2 rounded-full transition-transform duration-200 space-x-2 w-full`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Thêm vào giỏ</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
