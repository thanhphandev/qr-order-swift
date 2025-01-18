import { z } from "zod";

export const basicInformationSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  category: z.string(),
  subcategory: z.string().optional(),
  price: z.number().min(0, "Giá không được nhỏ hơn 0"),
});


export const pricingOptionsSchema = z.object({
  pricePerSize: z
    .array(
      z.object({
        size: z
          .string()
          .min(1, { message: 'Tên size không được để trống' }),
        price: z
          .number()
          .min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
      })
    )
    .optional(),
    
  toppings: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, { message: 'Tên topping không được để trống' }),
        price: z
          .number()
          .min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
      })
    )
    .optional()
    
});


export const additionalDetailsSchema = z.object({
  image: z.string().min(1, "Yêu cầu phải cung cấp hình ảnh"),
  isAvailable: z.boolean(),
  isBestSeller: z.boolean(),
});

export const productFormSchema = basicInformationSchema.merge(
  pricingOptionsSchema).merge(additionalDetailsSchema);

export type ProductFormValues = z.infer<typeof productFormSchema>;