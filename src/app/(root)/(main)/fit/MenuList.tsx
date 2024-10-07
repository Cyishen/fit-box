"use client";

import { useTemplateStore } from '@/lib/store';
import { useMenuModal } from '@/lib/use-menu-modal';
import { ChevronDown, ChevronRight, EllipsisVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import React from 'react';


interface MenuListProps {
  menus: Array<{ menuId: string; title: string }>;
  selectedMenuId: string | null;
  onMenuSelect: (menuId: string) => void;
  isMenuOpen: { [key: string]: boolean };
  onMenuRemove?: (menuId: string) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  menus,
  selectedMenuId,
  onMenuSelect,
  isMenuOpen,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const templates = useTemplateStore((state) => state.templates);

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

  const { open } = useMenuModal();
  const handleOpen = (menuId: string) => {
    open(menuId);
  };

  return (
    <div className='w-full flex items-center gap-3 overflow-x-scroll whitespace-nowrap pb-2'>
      {menus.length > 0 ? (
        menus.map((menu) => (
          <div
            key={menu.menuId}
            className={`flex items-center p-2 rounded-lg cursor-pointer gap-3 duration-300 ${selectedMenuId === menu.menuId ? "bg-black text-white" : "bg-gray-100"}`}
          >
            <div
              className='flex items-center gap-2'
              onClick={() => onMenuSelect(menu.menuId)}
            >
              <div className='flex flex-col'>
                <p className='font-bold'>{menu.title}</p>
                <p className='text-gray-400 text-sm font-bold'>
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

            {/* TODO: 測試 modal */}
            <div 
              onClick={() => handleOpen(menu.menuId)} 
              className='bg-white text-black w-8 h-8 rounded-full flex justify-center items-center'
            >
              <EllipsisVertical width={14}/>
            </div>
          </div>
        ))
      ) : (
        <div className='flex justify-center items-center w-40 h-20 border p-2 border-dashed border-black rounded-lg'>
          <p className='font-bold capitalize text-sm text-wrap'>
            建立新盒子
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuList;
