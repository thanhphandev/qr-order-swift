import React from 'react';
import { AlertTriangle, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";


interface DeleteConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string;
}

const DeleteConfirmationModal = ({
  isOpen,
  setIsOpen,
  onConfirm,
  itemName = 'mục này'
}: DeleteConfirmationModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-w-[440px] rounded-2xl shadow-xl">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-100 blur-xl animate-pulse" />
            <div className="relative h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-red-50 animate-ping opacity-20" />
              <AlertTriangle className="h-12 w-12 text-red-500 animate-bounce" />
            </div>
          </div>
        </div>

        <AlertDialogHeader className="pt-12">
          <AlertDialogTitle className="text-xl font-semibold text-center">
            Xác nhận xóa {itemName}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 text-center mt-4 space-y-2">
            <span>
              Bạn có chắc chắn muốn xóa {itemName} không?
            </span>

          </AlertDialogDescription>
          <p className="text-red-500 font-medium text-center">
            Dữ liệu này sẽ bị xóa vĩnh viễn
          </p>

        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 space-y-3">

          <div className="flex gap-3 justify-center w-full">
            <Button
              variant="outline"
              className="flex-1 max-w-[160px] border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Hủy bỏ
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 max-w-[160px] bg-red-500 rounded-xl hover:bg-red-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-300"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xác nhận xóa
            </Button>
          </div>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;