"use server"

import connectDB from "@/lib/mongodb";
import { Settings } from "@/models/Settings";
import type { SettingsType } from "@/types/settings";
import { revalidatePath } from "next/cache";

export async function createOrUpdateSettings(settingsData: SettingsType) {
    try {
        await connectDB();
        const existingSettings = await Settings.findOne({});
        if (existingSettings) {
            const updatedSettings = await Settings.findOneAndUpdate(
                {},
                { $set: settingsData },
                { new: true}
            );
            revalidatePath("/admin/settings");
            return { success: true, message: "Cập nhật thành công" };
        } else {
            const newSettings = new Settings(settingsData);
            await newSettings.save();

            return {
                success: true,
                message: "Tạo mới thành công"
            }
        }
    } catch (error) {
        console.error("Error in createOrUpdateSettings:", error);
    }
}


export async function getSettings() {
    try {
        await connectDB();

        const data = await Settings.findOne({});

        if (!data) {
            return null; // Không có dữ liệu
        }

        const settings: SettingsType = {
            restaurantName: data.restaurantName,
            logoUrl: data.logoUrl,
            description: data.description,
            tables: data.tables,
            tablesPerZone: data.tablesPerZone.map((z: { zone: string; count: number }) => ({
                zone: z.zone,
                count: z.count,
            })),
            contactInfo: {
                address: data.contactInfo.address,
                phone: data.contactInfo.phone,
                email: data.contactInfo.email,
            },
            bankAccount: {

                bankName: data.bankAccount.bankName,
                accountNumber: data.bankAccount.accountNumber,
                accountName: data.bankAccount.accountName,
            },
                
            socialMedia: {
                facebook: data.socialMedia.facebook,
                zalo: data.socialMedia.zalo,
                instagram: data.socialMedia.instagram,
            },
            telegramToken: data.telegramToken,
            chatId: data.chatId,
        };

        return settings;
    } catch (error) {
        console.error("Error in getSettings:", error);
        return null;
    }
}
