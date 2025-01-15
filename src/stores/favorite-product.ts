import { MenuItemType } from '@/types/menu-item';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteProductStore {
    favoriteProducts: MenuItemType[];
    addFavoriteProduct: (product: MenuItemType) => void;
    removeFavoriteProduct: (id: string) => void;
}

export const useFavoriteProductStore = create<FavoriteProductStore>()(
    persist(
        (set, get) => ({
            favoriteProducts: [],

            addFavoriteProduct: (product) => {

                const { favoriteProducts } = get();
                const isAlreadyFavorite = favoriteProducts.some((item) => item._id === product._id);

                if (!isAlreadyFavorite) {
                    set((state) => ({
                        favoriteProducts: [...state.favoriteProducts, product]
                    }));
                }
            },

            removeFavoriteProduct: (id) => {
                set((state) => ({
                    favoriteProducts: state.favoriteProducts.filter((product) => product._id !== id)
                }));
            }
        }),
        {
            name: 'favorite-products',
        }
    )
);
