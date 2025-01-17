'use client';

import React from 'react';
import type { CategoryType } from '@/types/category';
import SubCategoryList from '@/components/menu/subcategory';
import Link from 'next/link';
import { cn, getSegment } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useFavoriteProductStore } from '@/stores/favorite-product';

interface CategoryBarProps {
  categories: CategoryType[];
}

export function CategoryBar({ categories }: CategoryBarProps) {
  const pathname = usePathname();
  const { favoriteProducts } = useFavoriteProductStore();
  const pathSegments = getSegment(pathname);
  const categoryFromPath = pathSegments[1];
  const subcategoryFromPath = pathSegments[2];

  const selectedCategory = categoryFromPath || 'popular';
  const selectedCategoryData = categories.find((category) => category.path === selectedCategory);

  return (
    <nav className="bg-white border-t sticky z-40 top-0">
      <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar">
        {favoriteProducts.length > 0 && (
          <Link
            href="/menu/favorites/all"
            key="favorites"
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
              selectedCategory === 'favorites'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            )}
          >
            <span className="text-sm font-medium">Yêu thích</span>
          </Link>
        )}
        <Link
          href="/menu"
          key="popular"
          className={cn(
            'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
            selectedCategory === 'popular'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          )}
        >
          <span className="text-sm font-medium">Phổ biến</span>
        </Link>

        {categories.map((category) => (
          <Link
            href={`/menu/${category.path}/all`}
            key={category._id}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
              selectedCategory === category.path
                ? 'bg-orange-500 text-white'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            )}
          >
            <span className="text-sm font-medium">{category.name}</span>
          </Link>
        ))}
      </div>
      {selectedCategoryData && (
        <SubCategoryList
          selectedSubcategoryPath={subcategoryFromPath || 'all'}
          categoryPath={selectedCategoryData?.path || ''}
          subcategories={selectedCategoryData.subcategories || []}
        />
      )}
    </nav>
  );
}
