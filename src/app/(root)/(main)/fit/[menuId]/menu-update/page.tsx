"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MenuForm from '../../create-menu/MenuForm'
import { useMenuStore } from '@/lib/store'

import { useSession } from 'next-auth/react'
import { getMenuById, upsertMenu } from '@/actions/user-create'


const UpdateMenu = ({ params }: { params: { menuId: string } }) => {
  const { menuId } = params;
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false); 

  const { data: session } = useSession()
  const userId = session?.user?.id;

  //本地資料
  const menus = useMenuStore((state) => state.menus);
  const editMenu = useMenuStore((state) => state.editMenu);

  const [menu, setMenu] = useState<MenuType>({
    userId: userId || "Guest",
    id: menuId,
    title: "",
  })

  useEffect(() => {
    const initializeMenu = async () => {
      try {
        if (userId) {
          // 登入用戶：從資料庫獲取數據
          const dbMenu = await getMenuById(menuId);
          if (dbMenu) {
            setMenu(dbMenu as MenuType);
          } else {
            console.error("Menu not found");
            router.push("/fit");
          }
        } else {
          // 未登入用戶：從本地 store 獲取數據
          const localMenu = menus.find(m => m.id === menuId);
          if (localMenu) {
            setMenu(localMenu);
          } else {
            console.error("Menu not found in local storage");
            router.push("/fit");
          }
        }
      } catch (error) {
        console.error("Error loading menu:", error);
        router.push("/fit");
      }
    };

    initializeMenu();
  }, [userId, menuId, menus, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (userId) {
        await upsertMenu(menu)
    } else {
      const updatedMenu = {
        ...menu,
        title: menu.title,
      };

      editMenu(menuId, updatedMenu);
    }

    setIsLoading(false);
    router.push("/fit");
  };

  return (
    <MenuForm
      type="編輯"
      menu={menu}
      setMenu={setMenu}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}

export default UpdateMenu