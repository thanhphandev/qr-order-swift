import React, { useState } from 'react';
import type { SubcategoryType } from '@/types/category';
import { cn } from '@/lib/utils';
import { MinusCircleIcon, Plus } from 'lucide-react';
import { ModalAction } from '@/components/widgets/ModalAction';
import AddSubcategoryForm from '@/components/forms/AddSubcategory';
import { deleteSubcategory } from '@/actions/category.action';
import { toast } from 'sonner';


interface SubCategoryListProps {
  subCategories: SubcategoryType[];
  categoryId: string;
}

export function SubCategoryList({
  subCategories,
  categoryId,
}: SubCategoryListProps) {
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);

  const handleDeleteSubcategory = async(subcategoryId: string) => {
    try {
      await deleteSubcategory(subcategoryId);
      toast.success('Danh mục phụ đã được xoá!');
    } catch (error) {
      console.log(error);
      toast.error('Không thể xoá danh mục phụ. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-white flex flex-wrap border-t px-4 py-2 gap-3 animate-slideDown">
      <ModalAction
        title="Thêm danh mục con"
        isOpen={isAddSubcategoryOpen}
        setIsOpen={setIsAddSubcategoryOpen}
      >
        <AddSubcategoryForm
          categoryId={categoryId}
          onOpenChange={setIsAddSubcategoryOpen}
        />
      </ModalAction>

      <div className="flex flex-wrap gap-3 items-center">
        
      {subCategories.map((subCategory) => (
          <div
            key={subCategory._id}
            className="relative"
            onMouseEnter={() => setHoveredSubcategory(subCategory._id)}
            onMouseLeave={() => setHoveredSubcategory(null)}
          >
            <button
              className={cn(
                "px-4 py-2 rounded-xl border shadow-md font-semibold whitespace-nowrap transition-colors",
                hoveredSubcategory === subCategory._id
                  ? "bg-orange-500 text-white"
                  : "bg-white hover:text-white hover:bg-orange-500"
              )}
            >
              {subCategory.name}
            </button>
            {hoveredSubcategory === subCategory._id && (
              <button
                onClick={() => handleDeleteSubcategory(subCategory._id)}
                className={cn(
                  "absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm",
                  "text-red-500"
                )}
              >
                <MinusCircleIcon size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={() => setIsAddSubcategoryOpen(true)}
          className="px-4 py-2 bg-blue-500 rounded-xl text-white hover:bg-blue-600 transition-colors"
          aria-label="Add subcategory"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}
