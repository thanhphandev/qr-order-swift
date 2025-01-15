"use client";

import React, { useState } from "react";
import { Plus, MinusCircleIcon } from "lucide-react";
import type { CategoryType } from "@/types/category";
import { cn } from "@/lib/utils";
import { deleteCategory } from "@/actions/category.action";
import { Button } from "@/components/ui/button";
import { ModalAction } from "@/components/widgets/ModalAction";
import AddCategoryForm from "@/components/forms/AddCategoryForm";
import { SubCategoryList } from "./Subcategory";
import DeleteConfirmationModal from "../../widgets/DeleteConfirmationModal";
import AddMenuItem from "@/components/admin/menu/add-menu-item";
import { useCategoryStore } from "@/stores/categories-store";
import { toast } from "sonner";

interface CategoryBarProps {
  categories: CategoryType[];
}

export function CategoryBar({ categories }: CategoryBarProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (selectedCategory) {
      try {
        await deleteCategory(selectedCategory);
        toast.success("Danh mục đã được xoá!");
      } catch(error){
        console.log(error)
        toast.error("Không thể xoá danh mục. Vui lòng thử lại.");
      }
    }
    setIsDeleteConfirmOpen(false);
  };

  const selectedCategoryData = categories.find((category) => category._id === selectedCategory);

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

        <div className="flex items-center gap-3 p-4 border-b">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <div
                className="relative"
                key={category._id}
                onMouseEnter={() => setHoveredCategory(category._id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => setSelectedCategory(category._id)}
                  className={cn(
                    "px-4 py-2 rounded-xl transition-colors shrink-0",
                    selectedCategory === category._id
                      ? "bg-orange-500 text-white"
                      : "bg-orange-100 hover:bg-orange-50 text-black"
                  )}
                >
                  <span className="flex items-center gap-2">{category.name}</span>
                </button>
                {selectedCategoryData?.subcategories?.length === 0 && hoveredCategory === category._id && (
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className={cn(
                      "absolute -top-3 -right-2 p-1 bg-white rounded-full shadow-sm",
                      "text-red-500"
                    )}
                  >
                    <MinusCircleIcon size={16} />
                  </button>
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
        {selectedCategoryData && (
          <SubCategoryList
            subCategories={selectedCategoryData?.subcategories || []}
            categoryId={selectedCategoryData._id}
          />
        )}

      </div>
      {selectedCategoryData && (
        <AddMenuItem />
      )}
    </>
  );
}
