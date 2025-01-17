"use client";

import React, { useState } from "react";
import { Plus, MinusCircleIcon, PenIcon } from "lucide-react";
import type { CategoryType } from "@/types/category";
import { cn } from "@/lib/utils";
import { deleteCategory, isCategoryLinked } from "@/actions/category.action";
import { Button } from "@/components/ui/button";
import { ModalAction } from "@/components/widgets/ModalAction";
import AddCategoryForm from "@/components/forms/AddCategoryForm";
import DeleteConfirmationModal from "@/components/widgets/DeleteConfirmationModal";
import { useCategoryStore } from "@/stores/categories-store";
import { toast } from "sonner";
import EditCategoryForm from "@/components/forms/edit-category";
import { MenuItemType } from "@/types/menu-item";
import { SubCategoryList } from "@/components/admin/menu/subcategory";
import AddMenuItem from "@/components/admin/menu/add-menu-item";
import FilterProduct from "./filter-product";
import { useSubcategoryStore } from "@/stores/subcategories-store";

interface CategoryBarProps {
  categories: CategoryType[];
  products: MenuItemType[];
}

export function CategoryBar({ categories, products }: CategoryBarProps) {
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { selectedSubcategory } = useSubcategoryStore();
  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        const isLinked = await isCategoryLinked(selectedCategory._id);

        if (isLinked) {
          toast.error("Không thể xoá danh mục vì có dữ liệu liên quan trong danh mục này.");
          setIsDeleteConfirmOpen(false);
          return;
        }

        console.log("Danh mục này không có liên kết và có thể xóa.");
        await deleteCategory(selectedCategory._id);
        toast.success("Danh mục đã được xoá!");
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        toast.error("Không thể xoá danh mục. Vui lòng thử lại.");
      }
    }
    setIsDeleteConfirmOpen(false);
  };


  const hasProducts = (categoryId: string) => {
    return products.some((product) => product.category === categoryId);
  };

  const selectedCategoryData = selectedCategory ? categories.find((category) => category._id === selectedCategory._id) : null;

  return (
    <>
      <div className="rounded-xl flex flex-col w-full bg-white shadow-sm">
        <DeleteConfirmationModal
          isOpen={isDeleteConfirmOpen}
          setIsOpen={setIsDeleteConfirmOpen}
          onConfirm={confirmDelete}
        />
        <ModalAction title="Thêm danh mục" isOpen={isCategoryOpen} setIsOpen={setIsCategoryOpen}>
          <AddCategoryForm onOpenChange={setIsCategoryOpen} />
        </ModalAction>

        <ModalAction title="Sửa danh mục" isOpen={isEditFormOpen} setIsOpen={setIsEditFormOpen}>
          {selectedCategory && (
            <EditCategoryForm category={selectedCategory} onOpenChange={setIsEditFormOpen} />
          )}
        </ModalAction>

        <div className="flex items-center gap-3 p-4 border-b">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <div
                className="relative"
                key={category._id}
              >
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-xl transition-colors shrink-0",
                    selectedCategory?._id === category._id
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 hover:bg-orange-50 text-black"
                  )}
                >
                  <span className="flex items-center gap-2">{category.name}</span>
                </button>
                {selectedCategory && selectedCategory._id === category._id && (
                  hasProducts(category._id) || selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 ? (
                    <button
                      onClick={() => setIsEditFormOpen(true)}
                      className={cn(
                        "absolute -top-3 -right-2 p-1 bg-white rounded-full shadow-sm",
                        "text-blue-500"
                      )}
                    >
                      <PenIcon size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsDeleteConfirmOpen(true)}
                      className={cn(
                        "absolute -top-3 -right-2 p-1 bg-white rounded-full shadow-sm",
                        "text-red-500"
                      )}
                    >
                      <MinusCircleIcon size={16} />
                    </button>
                  )
                )}
              </div>
            ))}

            <Button
              onClick={() => setIsCategoryOpen(true)}
              className="px-4 py-2 bg-orange-500 rounded-xl text-white hover:bg-orange-600 shrink-0"
            >
              <Plus size={25} />
            </Button>
          </div>

        </div>
        {selectedCategory && (
          <SubCategoryList
            subCategories={selectedCategoryData?.subcategories || []}
            categoryId={selectedCategory._id}
            products={products}
          />
        )}
      </div>
      {selectedCategory && (
        <AddMenuItem />
      )}
      <FilterProduct products={products}
        categoryPath={selectedCategory?.path}
        subcategoryPath={selectedSubcategory?.path} />
    </>
  );
}
