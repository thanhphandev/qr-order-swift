import type { CategoryType } from '@/types/category';
import { create } from 'zustand'

interface CategoryStore {
    selectedCategory: CategoryType | null;
    setSelectedCategory: (category: CategoryType | null) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    selectedCategory: null,
    setSelectedCategory: (category: CategoryType | null) => set({ selectedCategory: category }),
}))