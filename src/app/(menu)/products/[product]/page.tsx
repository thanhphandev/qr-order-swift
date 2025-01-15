import { getProductBySlug } from '@/actions/menu-item.action';
import ProductDetail from '@/components/menu/product-details';
import NoResultsFound from '@/components/widgets/not-found-product';
import React from 'react'

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