import { create } from 'zustand'
import type { SubcategoryType } from '@/types/category';

interface SubcategoryStore {
    selectedSubcategory: SubcategoryType | null;
    setSelectedSubcategory: (subcategory: SubcategoryType) => void;
}

export const useSubcategoryStore = create<SubcategoryStore>((set) => ({
    selectedSubcategory: null,
    setSelectedSubcategory: (subcategory: SubcategoryType) => set({ selectedSubcategory: subcategory }),
}))
