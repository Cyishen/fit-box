"use client";


import { useTemplateStore } from '@/lib/store';
import { useMenuModal } from '@/lib/use-menu-modal';
import { ChevronDown, ChevronRight, EllipsisVertical } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { useSession } from "next-auth/react"
import { getTemplateByMenuId } from '@/actions/user-create';

interface MenuListProps {
  menus: MenuType[];
  selectedMenuId: string | null;
  onMenuSelect: (id: string) => void;
  isMenuOpen: { [key: string]: boolean };
}

const MenuList: React.FC<MenuListProps> = ({
  menus,
  selectedMenuId,
  onMenuSelect,
  isMenuOpen,
}) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const templates = useTemplateStore((state) => state.templates);

  const [templateCounts, setTemplateCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchTemplateCounts = async () => {
      if (userId) {
        // 資料庫
        const counts: { [key: string]: number } = {};
        for (const menu of menus) {
          const menuTemplate = await getTemplateByMenuId(menu.id);
          counts[menu.id] = menuTemplate.length;
        }

        setTemplateCounts(counts);
      } else {
        // 本地
        const counts: { [key: string]: number } = {};
        menus.forEach((menu) => {
          const localTemplates = templates.filter((template) => template.menuId === menu.id);
          counts[menu.id] = localTemplates.length;
        });

        setTemplateCounts(counts);
      }
    };

    fetchTemplateCounts();
  }, [menus, userId, templates]);


  const { open } = useMenuModal();
  const handleOpen = (id: string) => {
    open(id);
  };


  return (
    <div className='w-full flex items-center gap-3 overflow-x-scroll whitespace-nowrap'>
      {menus.length > 0 ? (
        menus.map((menu) => (
          <div
            key={menu.id}
            className={`flex items-center p-2 rounded-lg cursor-pointer gap-3 duration-300 w-40 ${selectedMenuId === menu.id ? "bg-black text-white" : "bg-slate-200"}`}
          >
            <div
              className='flex items-center gap-1'
              onClick={() => onMenuSelect(menu.id)}
            >
              <div className='flex flex-col'>
                <p className='font-bold line-clamp-2 min-w-20 max-w-20 min-h-10 max-h-10 whitespace-pre-wrap capitalize text-sm'>{menu.title}</p>
                <p className='text-gray-400 text-[10px]'>
                  模板數量 {templateCounts[menu.id] || 0}
                </p>
              </div>

              <div>
                {isMenuOpen[menu.id]
                  ? <ChevronDown width={20} height={20} />
                  : <ChevronRight width={20} height={20} />
                }
              </div>
            </div>

            {/* open modal */}
            <div
              onClick={() => handleOpen(menu.id)}
              className='bg-white text-black min-w-8 min-h-8 rounded-full flex justify-center items-center'
            >
              <EllipsisVertical width={14} />
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
