import { filterProducts } from '@/actions/menu-item.action';
import type { MenuItemType } from '@/types/menu-item';
import React, { useState, useEffect } from 'react';
import MenuItem from '@/components/admin/menu/menu-item';

interface FilterProductProps {
    products: MenuItemType[];
    categoryPath?: string | null;
    subcategoryPath?: string | null;
}

const FilterProduct = ({ products: initialData, categoryPath, subcategoryPath }: FilterProductProps) => {
    const [products, setProducts] = useState<MenuItemType[]>(initialData);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let data: MenuItemType[] = [];

                if (subcategoryPath) {
                    data = await filterProducts(undefined, subcategoryPath);
                } else if (categoryPath) {
                    data = await filterProducts(categoryPath);
                } else {
                    // If neither category nor subcategory is set, keep initial data
                    data = initialData;
                }

                // Only update the state if data has changed
                if (JSON.stringify(data) !== JSON.stringify(products)) {
                    setProducts(data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts();
    }, [categoryPath, subcategoryPath, initialData, products]);

    return (
        <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
                <MenuItem key={product._id} product={product} />
            ))}
        </div>
    );
};

export default FilterProduct;
