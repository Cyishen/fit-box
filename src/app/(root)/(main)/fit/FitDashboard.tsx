"use client"


import { useMenuStore, useTemplateStore } from '@/lib/store';
import { useEffect, useState, useTransition } from 'react';
import TemplateCardList from './TemplateCardList';
import MenuList from './MenuList';

import { deleteTemplateById } from '@/actions/user-create';
import { usePracticeModal } from '@/lib/use-practice-modal';


interface Props {
  menusData: MenuType[];
  templatesData: TemplateType[]
  userId?: string | null;
}

const FitDashboard = ({ menusData, userId, templatesData }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // 本地端
  const menus = useMenuStore((state) => state.menus);
  const templates = useTemplateStore((state) => state.templates);
  const removeTemplate = useTemplateStore((state) => state.removeTemplate);

  const { setDateAllTemplate } = usePracticeModal()

  useEffect(() => {
    if (userId && templatesData.length > 0) {
      setDateAllTemplate(templatesData)
    }
  }, [setDateAllTemplate, templatesData, userId])

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

    if (!userId) {
      // 資料庫
      selectMenu(lastSelectedMenuId, menus);
    } else {
      // 本地
      selectMenu(lastSelectedMenuId, menusData);
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

  const handleRemoveTemplate = async (templateId: string) => {
    try {
      if (userId) {
        startTransition(() => {
          deleteTemplateById(templateId)
        })
      } else {
        removeTemplate(templateId);
      }

    } catch (error) {
      console.log(error)
    }
  };


  return (
    <div className='flex flex-col gap-5 relative'>
      <MenuList
        menus={menusData?.length > 0 ? menusData : menus}
        selectedMenuId={selectedMenuId}
        onMenuSelect={handleMenuClick}
        isMenuOpen={isMenuOpen}
      />

      <TemplateCardList
        selectedTemplates={selectedTemplates}
        handleRemoveTemplate={handleRemoveTemplate}
        isPending={isPending}
      />
    </div>
  );
};

export default FitDashboard;
