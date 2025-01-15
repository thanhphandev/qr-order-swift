export interface CartProductType {
    _id: string;
    name: string;
    quantity: number;
    size?: string;
    toppings?: {
      name: string;
      price: number;
      quantity: number;
    }[];
    price: number;
    image: string;
  }