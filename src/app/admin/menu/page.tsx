import { CategoryBar } from '@/components/admin/menu/CategoryBar'
import { getCategories } from '@/actions/category.action'
import React from 'react'
import { getProducts } from '@/actions/menu-item.action';
import MenuItem from '@/components/admin/menu/menu-item';

const Menu = async () => {
  const categories = await getCategories();
  const products = await getProducts();
  return (
    <div>
      <CategoryBar categories={categories} />
      <div className="grid mt-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.slice().reverse().map((product) => (
          <MenuItem key={product._id} product={product} />
        ))}
      </div>

    </div>
  )
}

export default Menu