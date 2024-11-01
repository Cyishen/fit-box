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
import { useMenuStore, useTemplateStore } from "@/lib/store";

import { useSession } from 'next-auth/react'


const fetchMenuById = async (id: string) => {
  const response = await fetch(`/api/menus/${id}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch menu');
  }
  return response.json();
};

const deleteFetchMenuById = async (id: string) => {
  const response = await fetch(`/api/menus/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete menu');
  }
  return response.json();
};

export const MenuModal = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const { isOpen, close, id, dateAllMenu, setDateAllMenu } = useMenuModal();

  // 本地 menus 資料
  const removeMenu = useMenuStore((state) => state.removeMenu);
  const menus = useMenuStore((state) => state.menus);
  // 本地 templates 資料
  const addTemplate = useTemplateStore((state) => state.addTemplate);
  const templates = useTemplateStore((state) => state.templates);
  const countTemplate = templates.filter(template => template.menuId === id);

  // 資料庫 menus 資料
  const { data: session } = useSession()
  const userId = session?.user?.id

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


  const handleRemoveMenu = async (menuId: string) => {
    const userConfirmed = confirm("將會刪除此盒子內的所有模板,確定嗎");
    if (userConfirmed) {
      try {
        if (userId) {
          // 刪除資料 menu模型點擊的id
          await deleteFetchMenuById(menuId);
          // 更新 dateAllMenu，移除被刪除的菜單項目
          setDateAllMenu(dateAllMenu.filter(menu => menu.id !== menuId));
        } else {
          // 未登入用戶，從本地端刪除
          removeMenu(menuId);
        }
        close();
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 建立模板
  const generateTemplateId = () => {
    return Math.random().toString(36).substring(2, 6);
  };

  const handleAddTemplate = (menuId: string) => {
    const newCardId = generateTemplateId();
    const newTemplate: TemplateType = {
      userId: userId || "Guest",
      templateId: newCardId,
      templateCategory: "胸",
      templateTitle: "未命名訓練卡🗒︎",
      menuId: menuId,
      exercises: []
    };

    addTemplate(newTemplate);

    router.push(`/fit/${menuId}/${newCardId}/create-template`);

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
                onClick={() => handleRemoveMenu(openMenu.id)}
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
