import * as z from "zod";

export const categoryCreateSchema = z.object({
    category: z.string()
            .min(2, { message: "Danh mục phải có ít nhất 2 ký tự" })
            .max(50, { message: "Danh mục không được quá 50 ký tự" }),
})