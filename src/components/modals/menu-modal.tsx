"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Plus, Trash2, SquarePen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMenuModal } from "@/lib/use-menu-modal";
import { useDeleteMenuModal } from "@/lib/use-delete-modal";

import { useMenuStore, useTemplateStore } from "@/lib/store";

import { useSession } from 'next-auth/react'
import { upsertTemplate } from "@/actions/user-create";



const fetchMenuById = async (id: string) => {
  const response = await fetch(`/api/menus/${id}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch menu');
  }
  return response.json();
};


export const MenuModal = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { data: session } = useSession()
  const userId = session?.user?.id

  const { isOpen, close, id } = useMenuModal();
  const { openDelete } = useDeleteMenuModal();

  // 本地 menus 資料
  const menus = useMenuStore((state) => state.menus);
  // 本地 templates 資料
  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const templates = useTemplateStore((state) => state.templates);
  const countTemplate = templates.filter(template => template.menuId === id);

  // 用戶登入, 抓取資料庫用戶menu id
  const [dateMenuId, setDateMenuId] = useState<MenuType | null>(null);

  useEffect(() => {
    if (userId && id) {
      fetchMenuById(id)
        .then((data: MenuType) => setDateMenuId(data))
        .catch((error) => console.error(error));
    }
  }, [userId, id]);

  // 判斷打開小視窗id, 是資料庫的還是本地
  const openMenu = userId
    ? dateMenuId
    : menus.find((menu) => menu.id === id);

  // 刪除時, 打開另一個小視窗
  const handleDeleteOpen = (id: string) => {
    openDelete(id);
  };


  // Todo: 建立模板
  const generateTemplateId = () => {
    return Math.random().toString(36).substring(2, 6);
  };

  const handleAddTemplate = async (menuId: string) => {
    const dataAddTemplate: TemplateType = {
      userId: userId || "Guest",
      templateCategory: "胸",
      templateTitle: "未命名模板",
      menuId: menuId,
      exercises: [],
      templateId: null
    };

    if (userId) {
      // 資料庫
      const updatedTemplate = await upsertTemplate(dataAddTemplate);

      router.push(`/fit/${menuId}/${updatedTemplate.id}/create-template`);
    } else {
      // 本地
      const newCardId = generateTemplateId();

      dataAddTemplate.templateId = newCardId;
      // const localAddTemplate: TemplateType = {
      //   userId: userId || "Guest",
      //   templateCategory: "胸",
      //   templateTitle: "未命名模板🗒︎",
      //   menuId: menuId,
      //   exercises: [],
      //   templateId: newCardId,
      // };

      addTemplate(dataAddTemplate);

      router.push(`/fit/${menuId}/${newCardId}/create-template`);
    }

    close();
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
            模板數量 {countTemplate.length}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <div className="flex flex-col gap-2 w-full">
            <div className='flex w-full'>
              <button
                className='flex items-center gap-1 text-sm p-1 font-bold rounded-sm hover:bg-red-400 hover:text-white duration-300 bg-gray-100'
                onClick={() => handleDeleteOpen(openMenu.id)}
              >
                <Trash2 width={14} /> 刪除
              </button>
            </div>

            <div className='flex w-full'>
              <button
                className='w-full flex items-center justify-center gap-3 text-sm p-1 font-bold rounded-sm hover:bg-black hover:text-white duration-300 bg-gray-100'
                onClick={() => {
                  close();
                  router.push(`/fit/${id}/menu-update`);
                }}
              >
                <SquarePen width={14} /> 編輯盒子
              </button>
            </div>

            <div className='flex w-full'>
              <button
                className='w-full flex items-center justify-center gap-3 text-sm p-1 font-bold rounded-sm hover:bg-black hover:text-white duration-300 bg-gray-100'
                onClick={() => handleAddTemplate(openMenu.id)}
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
