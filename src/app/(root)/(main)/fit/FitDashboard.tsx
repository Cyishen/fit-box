"use client"


import { useMenuStore, useTemplateStore } from '@/lib/store';
import { useEffect, useState, useTransition } from 'react';
import TemplateCardList from './TemplateCardList';
import MenuList from './MenuList';

import { useSession } from 'next-auth/react'
import { getAllMenusByUserId } from '@/actions/user-create';



// const fetchAllMenus = async () => {
//   const response = await fetch(`/api/menus`);
//   if (!response.ok) {
//     throw new Error('Failed to fetch menu');
//   }
//   return response.json();
// };

const FitDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pending, startTransition] = useTransition();
  // 本地端
  const menus = useMenuStore((state) => state.menus);
  const templates = useTemplateStore((state) => state.templates);
  const removeTemplate = useTemplateStore((state) => state.removeTemplate);

  // 資料庫
  const { data: session } = useSession()
  const userId = session?.user?.id
  const [dateAllMenu, setDateAllMenu] = useState<MenuType[]>([])

  useEffect(() => {
    const lastSelectedMenuId = localStorage.getItem('selectedMenuId');
    const handleLocalMenuSelection = (lastSelectedMenuId: string) => {
      if (lastSelectedMenuId && menus.some(menu => menu.id === lastSelectedMenuId)) {
        setSelectedMenuId(lastSelectedMenuId);
        setIsMenuOpen({ [lastSelectedMenuId]: true });
      } else if (menus.length > 0) {
        const firstMenuId = menus[0].id;
        setSelectedMenuId(firstMenuId);
        setIsMenuOpen({ [firstMenuId]: true });
      } else {
        setSelectedMenuId(null);
      }
    };


    const fetchMenus = async () => {
      if (userId) {
        try {
          // const data = await fetchAllMenus();
          // setDateAllMenu(data);
          startTransition(() => {
            getAllMenusByUserId(userId)
              .then((data) => {
                setDateAllMenu(data as MenuType[]);
              })
              .catch((error) => {
                console.error('Error fetching menus:', error);
              });
          });
        } catch (error) {
          console.error('Error fetching menus:', error);
        }
      } else {
        handleLocalMenuSelection(lastSelectedMenuId as string);
      }
    };
  
    fetchMenus();
  }, [menus, userId]);


  const handleMenuClick = (id: string) => {
    setSelectedMenuId(id);
    localStorage.setItem('selectedMenuId', id);

    setIsMenuOpen((prev) => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean });

      newState[id] = true;
      return newState;
    });
  };

  // 以下模板設定
  const selectedTemplates = templates
    .filter(template => template.menuId === selectedMenuId)
    .slice()
    .reverse();

  const handleRemoveTemplate = (templateId: string) => {
    const userConfirmed = confirm("刪除此模板");
    if (userConfirmed) {
      removeTemplate(templateId);
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <MenuList
        menus={dateAllMenu.length > 0 ? dateAllMenu : menus}
        selectedMenuId={selectedMenuId}
        onMenuSelect={handleMenuClick}
        isMenuOpen={isMenuOpen}
      />

      <TemplateCardList
        selectedTemplates={selectedTemplates}
        handleRemoveTemplate={handleRemoveTemplate}
      />
    </div>
  );
};

export default FitDashboard;
