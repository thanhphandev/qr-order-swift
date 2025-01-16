interface Restaurant {
    _id: string;
    name: string; // Restaurant name
    ownerId: string; // Reference to User._id (owner/admin of the restaurant)
    settingsId: string; // Reference to Settings._id
    createdAt: Date;
    updatedAt: Date;
}


interface Settings {
    _id: string;
    restaurantId: string; // Reference to Restaurant._id
    logoUrl: string;
    restaurantName: string;
    description?: string;
    contactInfo: {
        phone: string;
        email: string;
        address: string;
    };
    openingHours: { 
        day: string;
        open: string;
        close: string;
    }[];
    languages: string[];
    socialMedia?: { 
        platform: string;
        url: string;
    }[];
    currency: string;
    taxSettings?: {
        taxRate: number;
        inclusive: boolean;
    };
    theme?: {
        primaryColor: string;
        secondaryColor: string;
    };
    notifications?: {
        enableEmail: boolean;
        enableSMS: boolean;
    };
    paymentSettings?: {
        methods: string[];
        onlinePaymentGateway?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}


interface Category {
    _id: string;
    restaurantId: string; // Reference to Restaurant._id
    name: string;
    subcategory: Subcategory[];
}

interface Subcategory {
    _id: string;
    categoryId: string; // Reference to Category._id
    name: string;
}

interface MenuItem {
    _id: string;
    restaurantId: string; // Reference to Restaurant._id
    name: string;
    description: string;
    category: string; // Link to Category._id
    subcategory?: string; // Link to Subcategory._id
    price: number;
    pricePerSize?: { size: string; price: number }[];
    image: string;
    isAvailable: boolean;
    isBestSeller: boolean;
    preparationTime?: number;
    options?: { name: string; price: number }[];
}


interface Order {
    _id: string;
    restaurantId: string; // Reference to Restaurant._id
    table: string;
    items: [{
        menuItem: string; // Link to MenuItem._id
        quantity: number;
        size?: string;
        options?: [{ name: string; price: number; }];
        itemPrice: number;
    }];
    status: status;
    customerName: string;
    typeOrder: typeOrder;
    deliveryAddress?: string;
    phoneNumber?: string;
    totalAmount: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}


interface User {
    _id: string;
    restaurantId: string; // Reference to Restaurant._id (if applicable)
    email: string;
    password: string;
    phone?: string;
    role: 'owner' | 'admin' | 'staff';
    createdAt: Date;
    updatedAt: Date;
}

interface Promotion {
    _id: string;
    restaurantId: string; // Reference to Restaurant._id
    title: string;
    description: string;
    discountPercentage?: number;
    discountAmount?: number;
    validFrom: Date;
    validUntil: Date;
    applicableMenuItems?: string[]; // References to MenuItem._id
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface Subscription {
    _id: string;
    name: string; // Tên gói (e.g., "Basic", "Pro", "Premium")
    pricePerMonth: number; // Giá mỗi tháng
    maxOrdersPerMonth: number; // Số lượng đơn hàng tối đa mỗi tháng
    maxTables: number; // Số lượng bàn tối đa hỗ trợ
    maxUsers: number; // Số lượng nhân viên tối đa
    features: string[]; // Danh sách tính năng (e.g., ['analytics', 'multi-language'])
    isActive: boolean; // Gói còn khả dụng không
    createdAt: Date;
    updatedAt: Date;
}

interface SubscriptionHistory {
    _id: string;
    restaurantId: string; // Reference đến Restaurant._id
    subscriptionId: string; // Reference đến Subscription._id
    startDate: Date; // Ngày bắt đầu gói
    endDate: Date; // Ngày hết hạn gói
    paymentStatus: 'paid' | 'unpaid'; // Tình trạng thanh toán
    amountPaid: number; // Số tiền đã thanh toán
    transactionId?: string; // Tham chiếu đến giao dịch thanh toán (nếu có)
    createdAt: Date;
    updatedAt: Date;
}


interface OrderAnalytics {
    _id: string;
    restaurantId: string; // Reference đến Restaurant._id
    totalOrders: number; // Tổng số đơn hàng
    totalRevenue: number; // Tổng doanh thu
    timeFrame: 'daily' | 'weekly' | 'monthly';
    startDate: Date;
    endDate: Date;
}
curl -H "Content-Type: application/json" \
     -H "Authorization: Bearer CBCEA2394D810355A862F0E6C83E0A6B7B4781A7B72234A9602BA51EE42B67E6" \
     -X POST "https://8e06a40d-3c42-4bc7-a848-37ccb8bde3b8.pushnotifications.pusher.com/publish_api/v1/instances/8e06a40d-3c42-4bc7-a848-37ccb8bde3b8/publishes" \
     -d '{"interests":["hello"],"web":{"notification":{"title":"Hello","body":"Hello, world!"}}}'

interface Payment {
    _id: string;
    orderId: string; // Reference to Order._id
    amountPaid: number;
    paymentMethod: PaymentMethod;
    paymentStatus: 'paid' | 'unpaid' | 'refunded';
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}