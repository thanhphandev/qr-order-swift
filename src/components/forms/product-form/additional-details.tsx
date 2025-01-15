'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { ProductFormValues } from '@/schemas/menu-item'
import ImageUpload from './image-upload';
const AdditionalDetails = () => {
    const form = useFormContext<ProductFormValues>();

    return (
        <div className='space-y-4'>
            <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange } }) => (
                    <FormItem>
                        <FormLabel>Hình ảnh</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <ImageUpload
                                    value={value || ''}
                                    onChange={onChange}
                                    onError={(error) => {
                                        toast.error(error)
                                        onChange('')
                                    }}
                                />
                                <input
                                    type="hidden"
                                    name="image"
                                    value={value || ''}
                                />
                            </div>
                        </FormControl>
                        <FormMessage className="text-sm font-medium text-red-500" />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                    <FormItem>
                        <div className='flex items-center justify-between rounded-xl border p-4'>
                            <div className='space-y-0.5'>
                                <FormLabel>Hiển thị</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Hiển thị món ăn trên trang web
                                </p>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-label="Toggle availability"
                                />
                            </FormControl>
                        </div>
                        <FormMessage className="text-sm font-medium text-red-500" />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="isBestSeller"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center justify-between rounded-xl border p-4">
                            <div className="space-y-0.5">
                                <FormLabel>Best Seller</FormLabel>
                                <p className="text-sm text-muted-foreground">
                                    Đánh dấu món ăn phổ biến nhất
                                </p>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-label="Toggle best seller"
                                />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}


export default AdditionalDetails