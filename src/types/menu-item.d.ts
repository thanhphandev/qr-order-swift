export interface MenuItemType {
    _id: string,
    slug?: string,
    name: string,
    description?: string,
    category: string, // Link to category._id
    subcategory?: string, // Link to subcategory._id
    price: number,
    pricePerSize?: { size: string; price: number }[],
    toppings?: { name: string; price: number }[];
    image: string,
    isAvailable: boolean,
    isBestSeller: boolean,
}