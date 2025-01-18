export interface SettingsType {
    restaurantName: string;
    logoUrl?: string;
    description?: string;
    contactInfo: {
        address: string;
        phone: string;
        email?: string;
        bankAccount?: {
            bankName: string;
            accountNumber: string;
            accountName: string;
        }
    };
    socialMedia?: {
        facebook?: string;
        zalo?: string;
        instagram?: string;
    }
    notifications?: {
        enableEmail: boolean;
        enableTelegram: boolean;
        enableMessenger: boolean;
    };
    
}