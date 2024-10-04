"use client"


import { useMenuStore, useTemplateStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import TemplateCardList from './TemplateCardList';
import MenuList from './MenuList';

const FitDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const templates = useTemplateStore((state) => state.templates);
  const removeTemplate = useTemplateStore((state) => state.removeTemplate);

  const menus = useMenuStore((state) => state.menus);
  // const removeMenu = useMenuStore((state) => state.removeMenu);

  useEffect(() => {
    const lastSelectedMenuId = localStorage.getItem('selectedMenuId');

    if (lastSelectedMenuId && menus.some(menu => menu.menuId === lastSelectedMenuId)) {
      setSelectedMenuId(lastSelectedMenuId);
      setIsMenuOpen({ [lastSelectedMenuId]: true });
    } else if (menus.length > 0) {
      const firstMenuId = menus[0].menuId;
      setSelectedMenuId(firstMenuId);
      setIsMenuOpen({ [firstMenuId]: true });
    } else {
      setSelectedMenuId(null);
    }
  }, [menus]);

  const handleMenuClick = (menuId: string) => {
    setSelectedMenuId(menuId);
    localStorage.setItem('selectedMenuId', menuId);

    setIsMenuOpen((prev) => {
      const newState = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean });

      newState[menuId] = true;
      return newState;
    });
  };

  const selectedTemplates = templates
    .filter(template => template.menuId === selectedMenuId)
    .slice()
    .reverse();

  // const handleRemoveMenu = (menuId: string) => {
  //   const userConfirmed = confirm("將會刪除此盒子內的所有模板,確定嗎");
  //   if (userConfirmed) {
  //     removeMenu(menuId);

  //     if (menuId === selectedMenuId) {
  //       setSelectedMenuId(null);
  //       localStorage.removeItem('selectedMenuId');
  //     }
  //   }
  // };

  const handleRemoveTemplate = (templateId: string) => {
    const userConfirmed = confirm("刪除此模板");
    if (userConfirmed) {
      removeTemplate(templateId);
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <MenuList
        menus={menus}
        selectedMenuId={selectedMenuId}
        onMenuSelect={handleMenuClick}
        isMenuOpen={isMenuOpen}
        onMenuRemove={()=>''}
      />

      <TemplateCardList
        selectedTemplates={selectedTemplates}
        handleRemoveTemplate={handleRemoveTemplate}
      />
    </div>
  );
};

export default FitDashboard;
