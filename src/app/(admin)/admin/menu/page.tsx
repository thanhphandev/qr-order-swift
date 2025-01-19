import { CategoryBar } from '@/components/admin/menu/category-bar'
import { getCategories } from '@/actions/category.action'
import React from 'react'
import { filterProducts, getProducts } from '@/actions/menu-item.action';
import MenuItem from '@/components/admin/menu/menu-item';

const Menu = async () => {
  const categories = await getCategories();
  const products = await getProducts();
  return (
    <div>
      <CategoryBar products={products} categories={categories} />

    </div>
  )
}

export default Menu