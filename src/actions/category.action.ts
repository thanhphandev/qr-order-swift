'use server';

import { Category, Subcategory } from '@/models/Category';
import { CategoryType, SubcategoryType } from '@/types/category';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { toPathLink } from '@/lib/utils';
import { MenuItem } from '@/models/MenuItem';

export async function addCategory(data: { name: string}) {
  try {

    await connectDB();
    const path = toPathLink(data.name);
    const category = new Category({ name: data.name, path: path });
    const savedCategory = await category.save();
    revalidatePath('/admin/menu');
    return {
      _id: savedCategory._id.toString(),
      name: savedCategory.name
    };
  } catch (error) {
    console.log(error)
    throw new Error('Failed to add category. Please try again.');
  }
}

export async function checkCategoryExists(name: string): Promise<boolean> {
  try {
    await connectDB();
    const existingCategory = await Category.findOne({ name });
    return !!existingCategory; // Trả về true nếu tồn tại
  } catch (error) {
    console.error("Error checking category existence:", error);
    throw new Error("Không thể kiểm tra danh mục. Vui lòng thử lại.");
  }
}

export async function checkSubcategoryExists(name: string): Promise<boolean> {
  try {
    await connectDB();
    const existingCategory = await Subcategory.findOne({ name });
    return !!existingCategory; // Trả về true nếu tồn tại
  } catch (error) {
    console.error("Error checking category existence:", error);
    throw new Error("Không thể kiểm tra danh mục phụ. Vui lòng thử lại.");
  }
}

export async function isCategoryLinked(categoryId: string): Promise<boolean> {
  try {
    const hasSubcategories = await Subcategory.exists({ categoryId: categoryId });
    const hasProducts = await MenuItem.exists({ category: categoryId });
    
    return !!hasSubcategories || !!hasProducts;
  } catch (error) {
    console.error("Lỗi khi kiểm tra liên kết của danh mục:", error);
    throw new Error("Không thể kiểm tra liên kết của danh mục.");
  }
}

export async function isSubcategoryLinked(subcategoryId: string): Promise<boolean> {
  try {
    const hasProducts = await MenuItem.exists({ subcategory: subcategoryId });
    
    return !!hasProducts;
  } catch (error) {
    console.error("Lỗi khi kiểm tra liên kết của danh mục:", error);
    throw new Error("Không thể kiểm tra liên kết của danh mục.");
  }
}

export async function getCategories(): Promise<CategoryType[]> {
  try {

    await connectDB();

    const categoriesData = await Category.find().populate('subcategories');

    const categories : CategoryType[] = categoriesData.map(category => ({
      _id: category._id.toString(),
      path: category.path,
      name: category.name,
      subcategories: category.subcategories?.map((subcategory: SubcategoryType) => ({
        _id: subcategory._id.toString(),
        path: subcategory.path,
        name: subcategory.name,
      })),
    }));

    return categories;

  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    throw new Error('Failed to fetch categories with subcategories. Please try again.');
  }
}


export async function addSubcategory(data: { name: string; categoryId: string }) {
  try {
    
    await connectDB();
    const path = toPathLink(data.name);
    const subcategory = new Subcategory({ name: data.name, path: path, categoryId: data.categoryId });
    const savedSubcategory = await subcategory.save();

    await Category.findByIdAndUpdate(data.categoryId, {
      $push: { subcategories: savedSubcategory._id },
    });
    revalidatePath('/admin/menu');
    return {
      _id: savedSubcategory._id.toString(),
      name: savedSubcategory.name
    }
  } catch (error) {
    console.error('Error adding subcategory:', error);
    throw new Error('Failed to add subcategory. Please try again.');
  }
}


export async function deleteCategory(categoryId: string) {
  try {
    await connectDB();

    // Delete all subcategories associated with the category
    await Subcategory.deleteMany({ categoryId });

    await Category.findByIdAndDelete(categoryId);
    revalidatePath('/admin/menu/categories');
    return {
      message: 'Category and subcategories deleted successfully.'
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw new Error('Failed to delete category. Please try again.');
  }
}

export async function deleteSubcategory(subcategoryId: string) {
  try {
    await connectDB();
    await Subcategory.findByIdAndDelete(subcategoryId);
    revalidatePath('/admin/menu/categories');
    return {
      message: 'Subcategory deleted successfully.'
    };
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    throw new Error('Failed to delete subcategory. Please try again.');
  }
}


export async function getSubcategories(categoryId: string) {
  try {
    // Connect to the database
    await connectDB();

    const data = await Subcategory.find({ categoryId }).exec();

    if (!data || data.length === 0) {
      return [];
    }
    const subcategories = data.map(subcategory => (
      {
        _id: subcategory._id.toString(),
        name: subcategory.name
      }
    ));
    return subcategories
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw new Error('Failed to fetch subcategories. Please try again.');
  }
}

export async function getAllSubcategories() : Promise<CategoryType[]>{
  try {
    await connectDB();
    const data = await Subcategory.find().exec();

    if (!data || data.length === 0) {
      return [];
    }
    const subcategories = data.map(subcategory => (
      {
        _id: subcategory._id.toString(),
        path: subcategory.path,
        name: subcategory.name
      }
    ));
    return subcategories
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw new Error('Failed to fetch subcategories. Please try again.');
  }
}

export async function updateCategory(categoryId: string, newName: string) {
  try {
    await connectDB();

    const newPath = toPathLink(newName);

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name: newName, path: newPath },
      { new: true }
    );

    if (!updatedCategory) {
      throw new Error('Category not found.');
    }

    revalidatePath('/admin/menu/categories');

    return {
      _id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      path: updatedCategory.path,
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category. Please try again.');
  }
}

export async function updateSubcategory(subcategoryId: string, newName: string) {
  try {
    await connectDB();

    const newPath = toPathLink(newName);

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      subcategoryId,
      { name: newName, path: newPath },
      { new: true }
    );

    if (!updatedSubcategory) {
      throw new Error('Subcategory not found.');
    }

    revalidatePath('/admin/menu/categories');

    return {
      _id: updatedSubcategory._id.toString(),
      name: updatedSubcategory.name,
      path: updatedSubcategory.path,
    };
  } catch (error) {
    console.error('Error updating subcategory:', error);
    throw new Error('Failed to update subcategory. Please try again.');
  }
}

