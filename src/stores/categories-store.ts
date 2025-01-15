import { create } from 'zustand'

interface CategoryStore {
    selectedCategory: string | null;
    setSelectedCategory: (categoryId: string | null) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
    selectedCategory: null,
    setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
}))