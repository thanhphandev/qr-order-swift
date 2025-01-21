export interface SettingsType {
    restaurantName: string;
    logoUrl?: string;
    description?: string;
    tables: number;
    tablesPerZone?: {
        zone: string;
        count: number;
    }[]
    contactInfo: {
        address: string;
        phone: string;
        email?: string;
    };
    bankAccount?: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    socialMedia?: {
        facebook?: string;
        zalo?: string;
        instagram?: string;
    };
    telegramToken?: string;
    chatId?: string;
    
}