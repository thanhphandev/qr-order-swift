"use client";

import React, { useState } from "react";
import { Plus, MinusCircleIcon, PenIcon } from "lucide-react";
import type { SubcategoryType } from "@/types/category";
import { cn } from "@/lib/utils";
import { deleteSubcategory, isSubcategoryLinked } from "@/actions/category.action";
import { Button } from "@/components/ui/button";
import { ModalAction } from "@/components/widgets/ModalAction";
import AddSubcategoryForm from "@/components/forms/AddSubcategory";
import { toast } from "sonner";
import EditSubcategoryForm from "@/components/forms/edit-subcategory";
import { MenuItemType } from "@/types/menu-item";
import { useSubcategoryStore } from "@/stores/subcategories-store";

interface SubCategoryListProps {
  subCategories: SubcategoryType[];
  categoryId: string;
  products: MenuItemType[];
}

export function SubCategoryList({
  subCategories,
  categoryId,
  products
}: SubCategoryListProps) {
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false);
  const { selectedSubcategory, setSelectedSubcategory } = useSubcategoryStore();
  const handleDeleteSubcategory = async (subcategoryId: string) => {
    try {
      const isLinked = await isSubcategoryLinked(subcategoryId);
      if (isLinked) {
        toast.error("Không thể xoá danh mục phụ vì có dữ liệu liên quan trong danh mục này.");
        return;
      }
      await deleteSubcategory(subcategoryId);
      toast.success("Danh mục phụ đã được xoá!");
    } catch (error) {
      console.log(error);
      toast.error("Không thể xoá danh mục phụ. Vui lòng thử lại.");
    }
  };

  const hasProducts = (subcategoryId: string) => {
    return products.some((product) => product?.subcategory === subcategoryId);
  };


  return (
    <>
      <div className="bg-white flex flex-wrap border-t px-4 py-2 gap-3 animate-slideDown">
        <ModalAction
          title="Thêm danh mục phụ"
          isOpen={isAddSubcategoryOpen}
          setIsOpen={setIsAddSubcategoryOpen}
        >
          <AddSubcategoryForm
            categoryId={categoryId}
            onOpenChange={setIsAddSubcategoryOpen}
          />
        </ModalAction>

        <ModalAction
          title="Sửa danh mục phụ"
          isOpen={isEditSubcategoryOpen}
          setIsOpen={setIsEditSubcategoryOpen}
        >
          {selectedSubcategory && (
            <EditSubcategoryForm
              subcategory={selectedSubcategory}
              onOpenChange={setIsEditSubcategoryOpen}
            />
          )}

        </ModalAction>

        <div className="flex flex-wrap gap-3 items-center">
          {subCategories.map((subCategory) => (
            <div
              key={subCategory._id}
              className="relative"
            >
              <button
                className={cn(
                  "px-4 py-2 rounded-xl border shadow-md font-semibold whitespace-nowrap transition-colors",
                  selectedSubcategory?._id === subCategory._id
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:text-white hover:bg-blue-500"
                )}
                onClick={() => setSelectedSubcategory(subCategory)}
              >
                {subCategory.name}
              </button>
              {selectedSubcategory?._id === subCategory._id && (
                hasProducts(subCategory._id) ? (
                  <button
                    onClick={() => setIsEditSubcategoryOpen(true)}
                    className={cn(
                      "absolute -top-3 -right-2 p-1 bg-white rounded-full shadow-sm",
                      "text-blue-500"
                    )}
                  >
                    <PenIcon size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeleteSubcategory(subCategory._id)}
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
            onClick={() => setIsAddSubcategoryOpen(true)}
            className="px-4 py-2 bg-blue-500 rounded-xl text-white hover:bg-blue-600 transition-colors"
            aria-label="Add subcategory"
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>
    </>
  );
}
