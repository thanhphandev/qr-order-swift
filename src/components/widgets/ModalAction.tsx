import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"

// import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area"

interface ModalActionProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string;
  description?: string;
}

export function ModalAction({
  children,
  isOpen,
  setIsOpen,
  title,
  description
}: ModalActionProps) {
  // const isMobile = useMediaQuery('(max-width: 640px)');
  // if (isMobile) {
  //   return (
  //     <Drawer open={isOpen} onOpenChange={setIsOpen}>
  //       <DrawerContent className="sm:max-w-[425px]">
  //         <DrawerHeader>
  //           <DrawerTitle className="text-orange-500 font-bold">{title}</DrawerTitle>
  //           {description && (
  //             <DrawerDescription>{description}</DrawerDescription>
  //           )}
  //         </DrawerHeader>
  //         <ScrollArea className="overflow-y-auto">
  //           {children}
  //         </ScrollArea>

  //       </DrawerContent>
  //     </Drawer>
  //   );
  // }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] md:max-w-screen-md">
        <DialogHeader>
          <DialogTitle className="text-orange-500 font-bold text-lg">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-gray-600 text-sm">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <ScrollArea className="overflow-y-auto max-h-[100%]">
          {children}
        </ScrollArea>
      </DialogContent>
    </Dialog>

  );
}
