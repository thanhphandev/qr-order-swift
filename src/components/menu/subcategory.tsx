'use client';

import React, { useEffect, useState } from 'react';
import type { SubcategoryType } from '@/types/category';
import Link from 'next/link';

interface SubCategoryListProps {
    subcategories: SubcategoryType[];
    categoryPath: string;
    selectedSubcategoryPath: string;
}

const SubCategoryList = ({ subcategories, categoryPath, selectedSubcategoryPath }: SubCategoryListProps) => {
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

    useEffect(() => {
        if (selectedSubcategoryPath) {
            setSelectedSubcategory(selectedSubcategoryPath);
        }
    }, [selectedSubcategoryPath]);

    if (subcategories.length === 0) return null;

    return (
        <div className="w-full border-t mx-auto px-4 py-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {subcategories.map((sub) => (
                    <Link
                        href={`/menu/${categoryPath}/${sub.path}`}
                        key={sub._id}
                        onClick={() => sub.path && setSelectedSubcategory(sub.path)}
                        className={`
                            px-4 py-2 rounded-2xl text-sm font-medium
                            transition-all duration-200
                            ${selectedSubcategory === sub.path
                                ? 'bg-orange-500 text-white shadow-lg'
                                : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700'
                            }
                        `}
                    >
                        {sub.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SubCategoryList;
