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

  // const router = useRouter();
  // const addTemplate = useTemplateStore((state) => state.addTemplate);
  // const existingMenu = useMenuStore((state) => state.menus);
  // const lastOneMenu = existingMenu.slice(-1)[0]?.menuId

  // const toggleMenuOptions = (menuId: string) => {
  //   setOpenMenuId(openMenuId === menuId ? null : menuId);
  // };

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

  // const generateShortId = () => {
  //   return Math.random().toString(36).substring(2, 6);
  // };
  // const handleAddTemplate = (menuId: string) => {
  //   const newCardId = generateShortId();
  //   const newTemplate = {
  //     cardId: newCardId,
  //     category: "胸",
  //     title: "換個名字吧",
  //     menuId: menuId,
  //     exercises: []
  //   };

  //   addTemplate(newTemplate);

  //   router.push(`/fit/${menuId}/${newCardId}/create-template`);
  // };

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

            {/* <div
              className='flex items-center justify-center hover:bg-gray-300 min-w-5 h-5 rounded-full relative'
              onClick={() => toggleMenuOptions(menu.menuId)}
            >
              <EllipsisVertical width={14} />

              {openMenuId === menu.menuId && (
                <>
                  <div className='fixed inset-0 bg-black/80 flex justify-center items-center z-50' />

                  <div className={`absolute ${existingMenu.length === 1 ? '-right-20' : (menu.menuId === lastOneMenu ? 'right-6' : '-right-20')} top-0 w-fit h-fit bg-white text-xl z-50 rounded-md shadow-lg overflow-hidden p-2 text-nowrap text-black`}>
                    <div className='flex justify-start'>
                      <button
                        className='flex items-center gap-1 text-sm p-1 font-bold rounded-sm hover:bg-red-400 hover:text-white duration-300'
                        onClick={() => onMenuRemove(menu.menuId)}
                      >
                        <Trash2 width={14} /> 刪除
                      </button>
                    </div>

                    <div className='flex justify-start'>
                      <button
                        className='flex items-center gap-1 text-sm p-1 font-bold rounded-sm hover:bg-black hover:text-white duration-300'
                        onClick={() => handleAddTemplate(menu.menuId)}
                      >
                        <Plus width={14} /> 新增
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div> */}
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
