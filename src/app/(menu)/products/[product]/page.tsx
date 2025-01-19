import { getProductBySlug, getProducts } from '@/actions/menu-item.action';
import ProductDetail from '@/components/menu/product-details';
import NoResultsFound from '@/components/widgets/not-found-product';
import React from 'react'

export const revalidate = 30

export const generateStaticParams = async () => {
    const products = await getProducts();
    return products.map((product) => ({
        product: product.slug,
    }))
}

const page = async ({ params }: { params: Promise<{ product: string }> }) => {
    const productSlug = (await params).product;
    const product = await getProductBySlug(productSlug);
    return (
        <div>
            {product ? <ProductDetail product={product} /> : <NoResultsFound />}
        </div>
    )
}

export default page