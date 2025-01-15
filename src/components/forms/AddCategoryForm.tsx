import React, { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addCategory } from "@/actions/category.action";
import { categoryCreateSchema } from '@/schemas/category';

interface AddCategoryFormProps {
    onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function AddCategoryForm({ onOpenChange }: AddCategoryFormProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof categoryCreateSchema>>({
        resolver: zodResolver(categoryCreateSchema),
        defaultValues: { category: "" },
    });

    const onSubmit = async (values: z.infer<typeof categoryCreateSchema>) => {
        setLoading(true);
        try {
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
                                <div className="relative">
                                    <Input
                                        {...field}
                                        aria-invalid={!!fieldState.error}
                                        aria-describedby={fieldState.error ? "category-error" : undefined}
                                        className={`w-full px-4 py-2 rounded-xl border transition-all duration-200 ${fieldState.error
                                                ? "border-red-500 focus:ring-red-200"
                                                : "border-orange-500 focus:ring-blue-200"
                                            } focus:border-gray-500 focus:ring-4`}
                                        placeholder="Nhập danh mục"
                                    />
                                    {fieldState.error && (
                                        <div
                                            id="category-error"
                                            className="absolute right-3 top-2.5 text-red-500"
                                            role="alert"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="8" x2="12" y2="12" />
                                                <line x1="12" y1="16" x2="12.01" y2="16" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
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
