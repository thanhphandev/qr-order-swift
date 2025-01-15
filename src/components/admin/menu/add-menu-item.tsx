'use client'

import React, { useState } from 'react'
import { ModalAction } from '@/components/widgets/ModalAction';
import NewProduct from '@/components/forms/product-form/new-product';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';


const AddMenuItem = () => {
    const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
    return (
        <div>
            <ModalAction
                title="Thêm mục menu"
                isOpen={isAddMenuItemOpen}
                setIsOpen={setIsAddMenuItemOpen}
            >
                <NewProduct onOpenChange={setIsAddMenuItemOpen} />
            </ModalAction>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                <div onClick={() => setIsAddMenuItemOpen(true)} className="flex justify-center flex-col bg-white border-orange-200 mt-5 items-center py-10 rounded-xl border-dashed border-2">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 transition-colors"
                    >
                        <Plus size={24} />
                        <span className="font-medium">Thêm món</span>
                    </Button>
                    <p className="mt-2 text-sm text-gray-400">
                        Thêm món mới vào thực đơn
                    </p>
                </div>
            </div>

        </div>

    )
}

export default AddMenuItem