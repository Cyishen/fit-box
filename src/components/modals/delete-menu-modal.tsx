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
import { Button } from "@/components/ui/button";


import { useSession } from 'next-auth/react'

import { deleteMenuById, getAllMenusByUserId } from "@/actions/user-create";

import { useMenuStore } from "@/lib/store";

import { useMenuModal } from "@/lib/use-menu-modal";
import { useDeleteMenuModal } from "@/lib/use-delete-modal";

// const deleteFetchMenuById = async (id: string) => {
//   const response = await fetch(`/api/menus/${id}`, {
//     method: 'DELETE',
//   });
//   if (!response.ok) {
//     throw new Error('Failed to delete menu');
//   }
//   return response.json();
// };

export const DeleteMenuModal = () => {
  const [isClient, setIsClient] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  const { isOpen, id, closeDelete } = useDeleteMenuModal();
  const { setDateAllMenu, close } = useMenuModal();

  // 本地 menus 資料
  const removeMenu = useMenuStore((state) => state.removeMenu);

  const handleRemoveMenu = async (menuId: string) => {
    try {
      if (userId) {
        // todo*刪除資料 (兩個方式都能立即更新畫面)

        // 方式一, 調用api刪除, 前端直接更新 dateAllMenu, 移除被刪除的菜單項目
        // await deleteFetchMenuById(menuId);
        // setDateAllMenu(dateAllMenu.filter(menu => menu.id !== menuId));

        // 方式二, 用伺服端, 刪除、取得更新
        await deleteMenuById(menuId);
        const updatedMenus = await getAllMenusByUserId(userId);
        setDateAllMenu(updatedMenus as MenuType[]);

      } else {
        // 未登入用戶，從本地端刪除
        removeMenu(menuId);
      }
      closeDelete()
      close();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    closeDelete()
    localStorage.removeItem('currentSessionId');
  };

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }

  if (!id) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeDelete}>
      <DialogContent className="max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl">

          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            會刪除此盒子內的所有模板,確定嗎?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <div className="flex w-full gap-3">
            <div className="flex w-full">
              <Button
                onClick={() => handleRemoveMenu(id)}
                className="w-full"
                variant='destructive'
              >
                刪除
              </Button>
            </div>

            <div className="flex w-full">
              <Button
                onClick={handleBack}
                className="w-full"
                variant='outline'
              >
                取消
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
