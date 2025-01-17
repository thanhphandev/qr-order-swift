import React from 'react'
import { filterProducts } from '@/actions/menu-item.action';
import { getAllSubcategories } from '@/actions/category.action';
import { Product } from '@/components/menu/product';
import NoResultsFound from '@/components/widgets/not-found-product';
import FavoriteProducts from '@/components/menu/favorites-product';

export const revalidate = 30

export async function generateStaticParams() {
  const subcategories = await getAllSubcategories();
  return subcategories.map((subcategory) => ({
    subcategory: subcategory.path,
  }))
}


const page = async ({ params }: { params: Promise<{ category: string; subcategory: string }> }) => {
  const { category, subcategory } = await params;
  if (category === 'favorites' && subcategory === 'all') {
    return <FavoriteProducts />;
  }

  const products = subcategory === 'all' ? await filterProducts(category)
    : await filterProducts(undefined, subcategory);
  if (!products || products.length === 0) {
    return <NoResultsFound />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  );
}

export default page