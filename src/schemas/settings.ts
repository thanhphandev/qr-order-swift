import { z } from 'zod'

const validatePhoneNumber = (phone: string): boolean => {
    const vietnamesePhoneRegex = /^(84|0[3|5|7|8|9])[0-9]{8}$/;
    return vietnamesePhoneRegex.test(phone);
  };
  

export const SettingsFormSchema = z.object({
    restaurantName: z.string().nonempty({
        message: 'Tên nhà hàng không được để trống'
    }),
    logoUrl: z.string().optional(),
    description: z.string().optional(),
    tables: z.number().int().positive({
        message: 'Số bàn phải là số nguyên dương'
    })
    .min(1, {
        message: 'Số bàn phải lớn hơn 0'
    }),
    tablesPerZone: z.array(z.object({
        zone: z.string().min(1, {
            message: 'Tên khu vực không được để trống'
        }),
        count: z.number().int().positive({
            message: 'Số bàn phải là số nguyên dương'
        })
        .min(1, {
            message: 'Số bàn phải lớn hơn 0'
        })
    })).optional(),
    contactInfo: z.object({
        address: z.string().nonempty({
            message: 'Địa chỉ không được để trống'
        }),
        phone: z.string().nonempty({
            message: 'Số điện thoại không được để trống'
        }).refine(validatePhoneNumber, {
            message: "Số điện thoại không hợp lệ",
          }),
        email: z.string().email().optional()
    }),
    bankAccount: z.object({
        bankName: z.string(),
        accountNumber: z.string(),
        accountName: z.string()
    }).optional(),
    socialMedia: z.object({
        facebook: z.string().optional(),
        zalo: z.string().optional(),
        instagram: z.string().optional()
    }).optional(),
    telegramToken: z.string().optional(),
    chatId: z.string().optional()

})

export type SettingsFormValues = z.infer<typeof SettingsFormSchema>