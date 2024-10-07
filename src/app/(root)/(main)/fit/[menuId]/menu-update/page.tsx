"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMenuStore } from '@/lib/store'
import MenuForm from '../../create-menu/MenuForm'


const CreateMenu = ({ params }: { params: { menuId: string } }) => {
  const { menuId } = params;
  const router = useRouter()

  const menus = useMenuStore((state) => state.menus);
  const existingMenu = menus.find(menu => menu.menuId === menuId);

  const [menu, setMenu] = useState<MenuType>({
    userId: "Guest",
    menuId:"",
    title: "",
  })

  useEffect(() => {
    if (existingMenu) {
      setMenu(existingMenu);
    }
  }, [existingMenu]);

  const editMenu = useMenuStore((state) => state.editMenu);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const newMenu = {
      ...menu,
      menuId,
      title: menu.title,
    };

    editMenu(menuId, newMenu);
  
    router.push("/fit");
  };

  return (
    <MenuForm
      type="編輯"
      menu={menu}
      setMenu={setMenu}
      handleSubmit={handleSubmit}
    />
  )
}

export default CreateMenu