"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import MenuForm, { MenuType } from './MenuForm'
import { useMenuStore } from '@/lib/store'


const CreateMenu = () => {
  const router = useRouter()

  const [menu, setMenu] = useState<MenuType>({
    menuId:"",
    title: "換個訓練表單名吧",
  })

  const addMenu = useMenuStore((state) => state.addMenu);

  const generateShortId = () => {
    return Math.floor(Math.random() * 10000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const newMenu = {
      ...menu,
      menuId: generateShortId().toString(),
      title: menu.title,
    };

    addMenu(newMenu);

    // 測試本地儲存
    // const storedBoxes = JSON.parse(localStorage.getItem('boxes') || '[]');
    // localStorage.setItem('boxes', JSON.stringify([...storedBoxes, newBox]));
  
    router.push("/fit");
  };

  return (
    <MenuForm
      type="新增"
      menu={menu}
      setMenu={setMenu}
      handleSubmit={handleSubmit}
    />
  )
}

export default CreateMenu