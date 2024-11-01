"use server"

import { prismaDb } from "@/lib/db"
import { auth } from "@/auth";

export const upsertMenu = async (data: MenuType) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // todo* 方式一 create與 update: 判斷 data 中有包含 id, 為更新操作
  if (data.id) {
    const updatedMenu = await prismaDb.menu.update({
      where: { id: data.id },
      data: {
        title: data.title
      }
    });

    return {
      id: updatedMenu.id,
      userId: updatedMenu.userId,
      title: updatedMenu.title
    } as MenuType;
  }

  // 新建操作
  const newMenu = await prismaDb.menu.create({
    data: {
      userId: data.userId,
      title: data.title
    }
  });

  return {
    id: newMenu.id,
    userId: newMenu.userId,
    title: newMenu.title
  } as MenuType;

  // todo* 方式二 upsert
  // const updatedMenu = await prismaDb.menu.upsert({
  //   where: { id: data.id },
  //   update: {
  //     title: data.title
  //   },
  //   create: {
  //     userId: userId,
  //     title: data.title
  //   }
  // });

  // return {
  //   id: updatedMenu.id,
  //   userId: updatedMenu.userId,
  //   title: updatedMenu.title
  // } as MenuType;
}

export const getAllMenusByUserId = async (id?: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const menus = await prismaDb.menu.findMany({
    where: { userId: id }
  })

  return menus
}

export const getMenuById = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const menu = await prismaDb.menu.findUnique({
    where: { id: id }
  })

  return menu
}

export const deleteMenuById = async (id: string) => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const menus = await prismaDb.menu.delete({
    where: { 
      id: id,
      userId: userId
    }
  })

  return menus
}
