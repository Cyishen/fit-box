"use client"


import { useMenuStore, useTemplateStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import TemplateCardList from './TemplateCardList';
import MenuList from './MenuList';

import { usePracticeModal } from '@/lib/use-practice-modal';

import { useSession } from "next-auth/react"


interface Props {
  menusData: MenuType[];
  templatesData: TemplateType[]
}

const FitDashboard = ({ menusData, templatesData }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [isMenuOpen, setIsMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  // 用戶未登入
  const menus = useMenuStore((state) => state.menus);
  const templates = useTemplateStore((state) => state.templates);

  // 以下menu設定
  const selectMenu = (menuId: string | null, menusList: MenuType[]) => {
    if (menuId && menusList.some(menu => menu.id === menuId)) {
      setSelectedMenuId(menuId);
      setIsMenuOpen({ [menuId]: true });
    } else if (menusList.length > 0) {
      const firstMenuId = menusList[0].id;
      setSelectedMenuId(firstMenuId);
      setIsMenuOpen({ [firstMenuId]: true });
    } else {
      setSelectedMenuId(null);
    }
  };

  useEffect(() => {
    const lastSelectedMenuId = localStorage.getItem('selectedMenuId');

    if (userId) {
      // 用戶登入
      selectMenu(lastSelectedMenuId, menusData);
    } else {
      // 用戶未登入
      selectMenu(lastSelectedMenuId, menus);
    }
  }, [menus, menusData, userId]);

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
  const selectedTemplates = userId
    ? templatesData.filter(template => template.menuId === selectedMenuId)
      .slice()
      .reverse()
    : templates.filter(template => template.menuId === selectedMenuId)
      .slice()
      .reverse();

  // 下載模板到本地: 第一步, 資料庫儲存到zustand, 頁面用 dataAllTemplate取資料
  const { setDataAllTemplate } = usePracticeModal()

  useEffect(() => {
    if (userId && templatesData.length > 0) {
      setDataAllTemplate(templatesData)
    } else {
      localStorage.removeItem('from-data-template-storage')
    }
  }, [setDataAllTemplate, templatesData, userId])

  return (
    <div className='flex flex-col gap-5 relative'>
      <MenuList
        menus={userId ? menusData : menus}
        selectedMenuId={selectedMenuId}
        onMenuSelect={handleMenuClick}
        isMenuOpen={isMenuOpen}
      />

      {selectedTemplates && selectedTemplates.length > 0 && (
        <TemplateCardList
          selectedTemplates={selectedTemplates}
        />
      )}
    </div>
  );
};

export default FitDashboard;
