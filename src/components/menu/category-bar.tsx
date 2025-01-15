'use client';

import React, { useEffect, useState } from 'react';
import type { CategoryType } from '@/types/category';
import SubCategoryList from '@/components/menu/subcategory';
import Link from 'next/link';
import { cn, getSegment } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface CategoryBarProps {
  categories: CategoryType[];
}

export function CategoryBar({ categories }: CategoryBarProps) {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string | null>("best-sellers");

  const pathSegments = getSegment(pathname);
  const categoryFromPath = pathSegments[1];
  const subcategoryFromPath = pathSegments[2];

  useEffect(() => {
    if (categoryFromPath) {
      const category = categories.find((category) => category.path === categoryFromPath);
      if (category) {
        setSelectedCategory(category.path || 'best-sellers');
      }
    }
  }, [categoryFromPath]);

  const handleCategoryClick = (categoryPath: string) => {
    setSelectedCategory(categoryPath);
  };

  const selectedCategoryData = categories.find((category) => category.path === selectedCategory);

  return (
    <nav className="bg-white border-t sticky z-40 top-0">
      <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar">
        
        <Link
          href={`/menu`}
          key="best-sellers"
          onClick={() => handleCategoryClick("best-sellers")}
          className={cn(
            'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
            selectedCategory === "best-sellers"
              ? 'bg-orange-500 text-white'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          )}
        >
          <span className="text-sm font-medium">
            Best Sellers
          </span>
        </Link>

        {categories.map((category) => (
          <Link
            href={`/menu/${category.path}`}
            key={category._id}
            onClick={() => handleCategoryClick(category.path || '')}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
              selectedCategory === category.path
                ? 'bg-orange-500 text-white'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            )}
          >
            <span className="text-sm font-medium">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
      {selectedCategory && selectedCategoryData && (
        <SubCategoryList
          selectedSubcategoryPath={subcategoryFromPath || ''}
          categoryPath={selectedCategoryData?.path || ''}
          subcategories={selectedCategoryData?.subcategories || []}
        />
      )}
    </nav>
  );
}
