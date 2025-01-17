import React from 'react'
import { filterProducts } from '@/actions/menu-item.action';
import { getCategories } from '@/actions/category.action';
import { Product } from '@/components/menu/product';
import NoResultsFound from '@/components/widgets/not-found-product';
import FavoriteProducts from '@/components/menu/favorites-product';

export const revalidate = 30

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: category.path,
  })) || [];
}

const page = async ({ params }: { params: Promise<{ category: string }> }) => {
  const categoryPath = (await params).category;
  if (categoryPath === 'favorites') {
      return <FavoriteProducts />
  }

  const products = await filterProducts(categoryPath);
  return (
    <>
      {products.length > 0 ?
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
        >
          {products.map((product) => (
            <Product key={product._id}
              product={product} />
          ))}
        </div>
        : <NoResultsFound />}
    </>
  )
}

export default page