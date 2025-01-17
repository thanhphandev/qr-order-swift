import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addCategory, checkCategoryExists } from "@/actions/category.action";
import { categorySchema } from "@/schemas/category";

interface AddCategoryFormProps {
    onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function AddCategoryForm({ onOpenChange }: AddCategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: { category: "" },
    });

    const onSubmit = async (values: z.infer<typeof categorySchema>) => {
        setLoading(true);
        try {
            const exists = await checkCategoryExists(values.category);
            if (exists) {
                form.setError("category", { type: "manual", message: "Tên danh mục đã tồn tại." });
                return;
            }
            await addCategory({ name: values.category });
            toast.success("Thêm danh mục thành công!");
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi gửi form", error);
            toast.error("Không thể gửi form. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full max-w-md mx-auto p-6"
                aria-label="Add Category Form"
            >
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field, fieldState }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium text-gray-700">Danh mục</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    aria-invalid={!!fieldState.error}
                                    aria-describedby={fieldState.error ? "category-error" : undefined}
                                    className={`w-full px-4 py-2 rounded-xl border transition-all duration-200 ${fieldState.error
                                        ? "border-red-500 focus:ring-red-200"
                                        : "border-orange-500 focus:ring-blue-200"
                                        }`}
                                    placeholder="Nhập danh mục"
                                />
                            </FormControl>
                            <FormMessage className="text-sm text-red-500 mt-1" />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 rounded-xl
            hover:from-orange-600 hover:to-orange-700 transition-all duration-200 
            focus:ring-4 focus:ring-orange-200 focus:outline-none"
                >
                    {loading ? "Đang xử lý..." : "Tạo mới"}
                </Button>
            </form>
        </Form>
    );
}
