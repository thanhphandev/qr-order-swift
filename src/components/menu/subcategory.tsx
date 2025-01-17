import React from 'react';
import type { SubcategoryType } from '@/types/category';
import Link from 'next/link';

interface SubCategoryListProps {
    subcategories: SubcategoryType[];
    categoryPath: string;
    selectedSubcategoryPath: string;
}

const SubCategoryList = ({ subcategories, categoryPath, selectedSubcategoryPath }: SubCategoryListProps) => {
    if (subcategories.length === 0) return null;

    return (
        <div className="w-full border-t mx-auto px-4 py-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <Link
                    href={`/menu/${categoryPath}/all`}
                    key="all"
                    className={`
                        px-4 py-2 rounded-2xl items-center flex text-sm text-nowrap font-medium
                        transition-all duration-200
                        ${selectedSubcategoryPath === 'all'
                            ? 'bg-orange-500 text-white shadow-xl'
                            : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700'
                        }
                    `}
                >
                    Tất cả
                </Link>
                {subcategories.map((sub) => (
                    <Link
                        href={`/menu/${categoryPath}/${sub.path}`}
                        key={sub._id}
                        className={`
                            px-4 py-2 rounded-2xl items-center flex text-sm text-nowrap font-medium
                            transition-all duration-200
                            ${selectedSubcategoryPath === sub.path
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
