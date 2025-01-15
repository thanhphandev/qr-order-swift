'use server';

import { Category, Subcategory } from '@/models/Category';
import { CategoryType, SubcategoryType } from '@/types/category';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { toPathLink } from '@/lib/utils';

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
