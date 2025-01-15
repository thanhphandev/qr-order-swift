"use client";

import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import BasicInformation from "@/components/forms/product-form/basic-information";
import PricingOptions from "@/components/forms/product-form/pricing-options";
import AdditionalDetails from "@/components/forms/product-form/additional-details";
import FormNavigation from "@/components/forms/product-form/navigate-button";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/schemas/menu-item";
import { toast } from "sonner";
import { updateProduct } from "@/actions/menu-item.action";
import { type MenuItemType } from "@/types/menu-item";

const stepComponents = [
  { component: BasicInformation, fields: ["name", "description", "subcategory"] },
  { component: PricingOptions, fields: ["price", "pricePerSize", "topping"] },
  { component: AdditionalDetails, fields: ["image", "isAvailable", "isBestSeller"] },
];

interface EditProductProps {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  product: MenuItemType;
}

export default function EditProduct({ onOpenChange, product }: EditProductProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product,
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      await updateProduct(product._id, values); // Gọi API để cập nhật
      onOpenChange(false);
      toast.success("Cập nhật sản phẩm thành công");
    } catch (error) {
      console.error("Error updating product", error);
      toast.error("Lỗi cập nhật sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = stepComponents[step].component;

  const next = async () => {
    const fieldsToValidate = stepComponents[step].fields as (keyof ProductFormValues)[];
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setStep((current) => Math.min(current + 1, stepComponents.length - 1));
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi tiếp tục");
    }
  };

  const previous = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  return (
    <div className="flex flex-col space-y-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-6"
        >
          {/* Hiển thị bước hiện tại */}
          <CurrentStepComponent />

          {/* Nút điều hướng */}
          <FormNavigation
            step={step}
            isSubmitting={isSubmitting}
            previous={previous}
            next={next}
          />
        </form>
      </Form>
    </div>
  );
}
