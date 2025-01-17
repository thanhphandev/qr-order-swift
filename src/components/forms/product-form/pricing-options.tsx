'use client'

import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Donut, Ruler } from 'lucide-react'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import type { ProductFormValues } from '@/schemas/menu-item'

const PricingOptions = () => {
    const form = useFormContext<ProductFormValues>();
    const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
        control: form.control,
        name: 'pricePerSize',
    });

    const { fields: toppingFields, append: appendTopping, remove: removeTopping } = useFieldArray({
        control: form.control,
        name: "toppings",
    });

    return (
        <div className='space-y-9'>
            <div className="overflow-auto">
                <div className='flex items-center justify-between mb-4'>
                    <p className="text-sm font-semibold flex items-center gap-2">
                        <Ruler className="w-4 h-4" />
                        Tùy chọn Size
                    </p>
                    <Button type='button' variant="outline" size="sm" onClick={() => appendSize({ size: '', price: 0 })}>
                        <Plus className='h-4 w-4 mr-2' />
                        Thêm size
                    </Button>
                </div>
                <div className="space-y-3 max-h-[150px] overflow-y-auto">
                    {sizeFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex gap-4 items-center"
                        >
                            <FormField
                                control={form.control}
                                name={`pricePerSize.${index}.size`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                            Size
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Size name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`pricePerSize.${index}.price`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                            Giá
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Giá"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value;
                                                    const numericValue = parseFloat(rawValue);
                                                    if (!isNaN(numericValue) || rawValue === "") {
                                                        field.onChange(numericValue); // Update value in form as a number
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const numericValue = parseFloat(e.target.value);
                                                    if (!isNaN(numericValue)) {
                                                        field.onChange(numericValue);
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-center mt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSize(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className='flex items-center justify-between mb-4'>
                    <p className="text-base font-semibold flex items-center gap-2">
                        <Donut className="w-4 h-4" />
                        Tùy chọn Topping
                    </p>
                    <Button type='button' variant="outline" size="sm" onClick={() => appendTopping({ name: '', price: 0 })}>
                        <Plus className='h-4 w-4 mr-2' />
                        Thêm topping
                    </Button>
                </div>

                <div className='space-y-4 max-h-[150px] overflow-y-auto'>
                    {toppingFields.map((field, index) => (
                        <div key={field.id} className='flex gap-4 items-center'>
                            <FormField
                                control={form.control}
                                name={`toppings.${index}.name`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                            Topping
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Topping..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`toppings.${index}.price`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>
                                            Giá
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Price"
                                                {...field}
                                                value={field.value || ""}
                                                onChange={(e) => {
                                                    const rawValue = e.target.value;
                                                    const numericValue = parseFloat(rawValue);
                                                    if (!isNaN(numericValue) || rawValue === "") {
                                                        field.onChange(numericValue); // Update value in form as a number
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const numericValue = parseFloat(e.target.value);
                                                    if (!isNaN(numericValue)) {
                                                        field.onChange(numericValue); // Ensure the value is always stored as a number
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-center mt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeTopping(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PricingOptions;
