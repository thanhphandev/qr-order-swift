import * as z from "zod";

export const subcategoryCreateSchema = z.object({
    subcategory: z.string()
                .min(2, {message: "Tên danh mục con phải có ít nhất 2 ký tự"})
                .max(50, {message: "Tên danh mục con không được quá 50 ký tự"}),
});