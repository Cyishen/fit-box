"use client";

import Link from 'next/link';
import { useMenuStore, useTemplateStore } from '@/lib/store';
import { ChevronDown, ChevronRight, EllipsisVertical, Plus, Trash2, } from 'lucide-react';
import { useEffect, useState } from 'react';
import React from 'react';

interface MenuListProps {
  menus: Array<{ menuId: string; title: string }>;
  selectedMenuId: string | null;
  onMenuSelect: (menuId: string) => void;
  isMenuOpen: { [key: string]: boolean };
  onMenuRemove: (menuId: string) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  menus,
  selectedMenuId,
  onMenuSelect:
  handleMenuClick,
  isMenuOpen,
  onMenuRemove,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const templates = useTemplateStore((state) => state.templates);
  
  const existingMenu = useMenuStore((state) => state.menus);
  const lastOneMenu = existingMenu.slice(-1)[0]?.menuId

  const toggleMenuOptions = (menuId: string) => {
    setOpenMenuId(openMenuId === menuId ? null : menuId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !((event.target as HTMLElement).closest('#outside-close'))) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className='w-full flex items-center gap-3 overflow-x-scroll whitespace-nowrap pb-10'>
      {menus.length > 0 ? (
        menus.map((menu) => (
          <div
            key={menu.menuId}
            className={`flex p-2 rounded-lg cursor-pointer gap-3 duration-300 ${selectedMenuId === menu.menuId ? "bg-black text-white" : "bg-gray-100"}`}
          >
            <div
              className='flex items-center gap-1'
              onClick={() => handleMenuClick(menu.menuId)}
            >
              <div className='flex flex-col'>
                <p className='font-bold text-sm'>{menu.title}</p>
                <p className='text-gray-500 text-[10px]'>
                  {templates.filter(template => template.menuId === menu.menuId).length}
                </p>
              </div>

              <div>
                {isMenuOpen[menu.menuId]
                  ? <ChevronDown width={20} height={20} />
                  : <ChevronRight width={20} height={20} />
                }
              </div>
            </div>

            <div
              className='flex items-center justify-center hover:bg-gray-300 min-w-5 h-5 rounded-full relative'
              onClick={() => toggleMenuOptions(menu.menuId)}
            >
              <EllipsisVertical width={14} />

              {openMenuId === menu.menuId && (
                <>
                  <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50' />

                  <div className={`absolute ${menu.menuId === lastOneMenu ? 'right-6' : '-right-20'}  top-0 w-fit h-fit bg-white text-xl z-50 rounded-md shadow-lg overflow-hidden p-2 text-nowrap text-black`}>
                    <div className='flex justify-start'>
                      <button
                        className='flex items-center gap-1 text-sm p-1 font-bold rounded-sm hover:bg-red-400 hover:text-white duration-300'
                        onClick={() => onMenuRemove(menu.menuId)}
                      >
                        <Trash2 width={14} /> 刪除
                      </button>
                    </div>

                    <div className='flex justify-start'>
                      <Link href={`/fit/${menu.menuId}/create-template`}>
                        <button
                          className='flex items-center gap-1 text-sm p-1 font-bold rounded-sm hover:bg-black hover:text-white duration-300'
                        >
                          <Plus width={14} /> 新增
                        </button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className='font-bold capitalize text-sm'>建立新盒子吧</p>
      )}
    </div>
  );
};

export default MenuList;
