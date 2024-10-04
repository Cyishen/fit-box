"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMenuModal } from "@/lib/use-menu-modal";
import { useMenuStore, useTemplateStore } from "@/lib/store";
import { useRouter } from 'next/navigation';

import { Plus, Trash2, SquarePen } from 'lucide-react';


export const MenuModal = () => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close, menuId } = useMenuModal();
  const router = useRouter();

  const removeMenu = useMenuStore((state) => state.removeMenu);
  const menus = useMenuStore((state) => state.menus);
  const openMenu = menus.find((menu) => menu.menuId === menuId);

  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const templates = useTemplateStore((state) => state.templates);
  const countTemplate = templates.filter(template => template.menuId === menuId);

  const generateShortId = () => {
    return Math.random().toString(36).substring(2, 6);
  };

  const handleAddTemplate = (menuId: string) => {
    const newCardId = generateShortId();
    const newTemplate = {
      cardId: newCardId,
      category: "胸",
      title: "換個訓練菜單名吧",
      menuId: menuId,
      exercises: []
    };

    addTemplate(newTemplate);

    router.push(`/fit/${menuId}/${newCardId}/create-template`);

    close();
  };

  const handleRemoveMenu = (menuId: string) => {
    const userConfirmed = confirm("將會刪除此盒子內的所有模板,確定嗎");
    if (userConfirmed) {
      removeMenu(menuId);
    }
  };

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  if (!openMenu) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-[220px] sm:max-w-sm rounded-lg p-2">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl mt-8">
            {openMenu?.title}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            目前模板數量 {countTemplate.length}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <div className="flex flex-col gap-2 w-full">
            <div className='flex w-full'>
              <button
                className='flex items-center gap-1 text-sm p-1 font-bold rounded-sm hover:bg-red-400 hover:text-white duration-300 bg-gray-100'
                onClick={() => handleRemoveMenu(openMenu.menuId)}
              >
                <Trash2 width={14} /> 刪除
              </button>
            </div>

            <div className='flex w-full'>
              <button
                className='w-full flex items-center justify-center gap-3 text-sm p-1 font-bold rounded-sm hover:bg-black hover:text-white duration-300 bg-gray-100'
                onClick={() => {
                  close();
                  router.push(`/fit/${menuId}/menu-update`);
                }}
              >
                <SquarePen width={14} /> 編輯
              </button>
            </div>

            <div className='flex w-full'>
              <button
                className='w-full flex items-center justify-center gap-3 text-sm p-1 font-bold rounded-sm hover:bg-black hover:text-white duration-300 bg-gray-100'
                onClick={() => handleAddTemplate(openMenu.menuId)}
              >
                <Plus width={14} /> 新增模板
              </button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
