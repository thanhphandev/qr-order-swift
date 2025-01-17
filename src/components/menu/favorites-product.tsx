"use client"

import React, { useState, useEffect } from 'react'
import { useFavoriteProductStore } from '@/stores/favorite-product'
import { MenuItemType } from '@/types/menu-item';
import { Product } from '@/components/menu/product';
import NoResultsFound from '@/components/widgets/not-found-product';

const FavoriteProducts = () => {
    const [favorites, setFavorites] = useState<MenuItemType[]>([]);
    const { favoriteProducts } = useFavoriteProductStore();
    useEffect(() => {
        setFavorites(favoriteProducts)
    }, [favoriteProducts])
    return (
        <>
            {favorites.length > 0 ?
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
                >
                    {favorites.map((product) => (
                        <Product key={product._id}
                            product={product} />
                    ))}
                </div>
            : <NoResultsFound />}

        </>
    )
}

export default FavoriteProducts