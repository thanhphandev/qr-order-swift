export type status = 'pending' | 'completed' | 'paid';
export type typeOrder = 'dine-in' | 'take-away' | 'delivery';

export interface OrderType {
    _id: string,
    table?: string,
    items: [{
        _id: string,
        name: string,
        quantity: number,
        size?: string,
        topping?: [{
            name: string,
            price: number,
            quantity: number,
        }],
        price: number,
    }],
    status: status,
    typeOrder: typeOrder,
    customerInfo?: {
        customerName?: string | null,
        phoneNumber?: string | null,
        deliveryAddress?: string | null,
    } | null,
    totalAmount: number,
    notes: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface CreateOrderData {
    table: string | null;
    items: {
        _id: string;
        name: string;
        quantity: number;
        size?: string;
        price: number;
        toppings?: {
            name: string;
            price: number;
            quantity: number;
        }[];
    }[];
    status: status;
    typeOrder: typeOrder;
    customerInfo?: {
        name?: string | null,
        phone?: string | null,
        address?: string | null,
    } | null,
    totalAmount: number;
    notes?: string;
}

export interface Filters {
  status: status | null;
  typeOrder: typeOrder | null;
  fromDate: string;
  toDate: string;
}