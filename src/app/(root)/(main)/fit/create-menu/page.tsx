"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import MenuForm from './MenuForm'
import { useMenuStore } from '@/lib/store'

import { useSession } from 'next-auth/react'
import { upsertMenu } from '@/actions/user-create'


const CreateMenu = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false); 

  const { data: session } = useSession()
  const userId = session?.user?.id

  const generateShortId = () => {
    return Math.floor(Math.random() * 10000);
  };

  const [menu, setMenu] = useState({
    userId: userId || "Guest",
    title: "未命名訓練盒🗒︎",
    id: '',
  })

  const addMenu = useMenuStore((state) => state.addMenu);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if(userId) {
      await upsertMenu(menu)
    } else {
      const newMenu = {
        ...menu,
        id: generateShortId().toString(),
        title: menu.title,
      };
      addMenu(newMenu);
    }

    setIsLoading(false);
  
    router.push("/fit");
  };

  return (
    <MenuForm
      type="新增"
      menu={menu}
      setMenu={setMenu}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}

export default CreateMenu