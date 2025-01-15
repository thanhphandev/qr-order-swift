export interface SubcategoryType {
    _id: string;
    path?: string;
    name: string;
}

export interface CategoryType {
    _id: string;
    name: string;
    path?: string;
    subcategories?: Subcategory[];
}
