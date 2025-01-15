'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { DollarSign, FileText, Tag, ListFilter } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import type { ProductFormValues } from '@/schemas/menu-item'
import { useCategoryStore } from '@/stores/categories-store'
import { getSubcategories } from '@/actions/category.action'
import { SubcategoryType } from '@/types/category'

const BasicInformation = () => {
  const form = useFormContext<ProductFormValues>()
  const { selectedCategory } = useCategoryStore()
  const [subcategories, setSubcategories] = useState<SubcategoryType[]>([])

  const fetchSubcategoriesData = async () => {
    if (selectedCategory) {
      const subcategories = await getSubcategories(selectedCategory)
      setSubcategories(subcategories)
    }
  }

  useEffect(() => {
    fetchSubcategoriesData()
  }, [selectedCategory])

  return (
    <div className="w-full mx-auto">
      <div className="space-y-4">
        {/* Top section with name and price */}
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span className="inline-block">Tên món *</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên món"
                    type="text"
                    className="h-11 text-base transition-colors focus:ring-2 w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm font-medium text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="inline-block">Giá *</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập giá"
                    aria-label="Giá"
                    type="number"
                    className="h-11 text-base transition-colors focus:ring-2 rounded-lg w-full"
                    value={field.value || ""}
                    onChange={(e) => {
                      const rawValue = e.target.value
                      const numericValue = parseFloat(rawValue)
                      if (!isNaN(numericValue) || rawValue === "") {
                        field.onChange(numericValue)
                      }
                    }}
                    onBlur={(e) => {
                      const numericValue = parseFloat(e.target.value)
                      if (!isNaN(numericValue)) {
                        field.onChange(numericValue)
                      }
                    }}
                  />
                </FormControl>
                <FormDescription className="text-sm text-gray-500">
                  Giá bán của món ăn
                </FormDescription>
                <FormMessage className="text-sm font-medium text-red-500">
                  {form.formState.errors.price?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        {/* Description section */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="inline-block">Mô tả *</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Mô tả ngắn giới thiệu về sản phẩm"
                  className="min-h-32 text-base transition-colors focus:ring-2 resize-none rounded-xl w-full"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-sm text-gray-500">
                Thêm thông tin chi tiết về món ăn
              </FormDescription>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />

        {/* Subcategory section */}
        <FormField
          control={form.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-base font-semibold flex items-center gap-2">
                <ListFilter className="w-4 h-4" />
                <span className="inline-block">Danh mục phụ</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <SelectTrigger className="h-11 text-base transition-colors focus:ring-2 rounded-xl">
                    {field.value
                      ? subcategories.find((sub) => sub._id === field.value)?.name
                      : "Chọn danh mục phụ"}
                  </SelectTrigger>
                  <SelectContent className="max-h-48 overflow-y-auto">
                    {subcategories.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Chưa có danh mục phụ. Vui lòng thêm danh mục phụ.
                      </div>
                    ) : (
                      subcategories.map((subcategory) => (
                        <SelectItem key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default BasicInformation