import { getSettings } from '@/actions/settings.action';
import type { SettingsType } from '@/types/settings';
import { create } from 'zustand';

interface SettingsStore {
    settings: SettingsType;
    updateSettings: (settings: SettingsType) => void;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    settings: {
        logoUrl: "",
        restaurantName: "",
        tables: 10,
        contactInfo: {
            address: "",
            phone: ""
        }
    },
    updateSettings: (settings: SettingsType) => set({ settings }),
    fetchSettings: async() => {
        try {
            const settings = await getSettings();
            if(settings){
                set({ settings });
            }
        }catch(error){
            console.error("Error in fetchSettings:", error)
        }
    }
}))