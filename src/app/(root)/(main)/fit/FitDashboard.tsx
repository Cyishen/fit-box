"use client"


import { useMenuStore, useTemplateStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import TemplateCardList from './TemplateCardList';
import MenuList from './MenuList';

// import { getAllMenusByUserId } from '@/actions/user-create';
// import { useMenuModal } from '@/lib/use-menu-modal';

// import { Loader } from 'lucide-react';


interface Props {
  menusData: MenuType[];
  userId?: string | null;
}

const FitDashboard = ({ menusData, userId }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  // 本地端
  const menus = useMenuStore((state) => state.menus);
  const templates = useTemplateStore((state) => state.templates);
  const removeTemplate = useTemplateStore((state) => state.removeTemplate);

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
      selectMenu(lastSelectedMenuId, menus);
    } else {
      selectMenu(lastSelectedMenuId, menusData);
    }
  }, [menus, menusData, userId]);

  // 方式二: 用zustand管理 menu變動, 取得新資料渲染畫面 UI
  // const { setDateAllMenu } = useMenuModal();
  // const [pending, startTransition] = useTransition();

  // useEffect(() => {
  //   const lastSelectedMenuId = localStorage.getItem('selectedMenuId');
  //   const handleLocalMenuSelection = (lastSelectedMenuId: string) => {
  //     if (lastSelectedMenuId && menus.some(menu => menu.id === lastSelectedMenuId)) {
  //       setSelectedMenuId(lastSelectedMenuId);
  //       setIsMenuOpen({ [lastSelectedMenuId]: true });
  //     } else if (menus.length > 0) {
  //       const firstMenuId = menus[0].id;
  //       setSelectedMenuId(firstMenuId);
  //       setIsMenuOpen({ [firstMenuId]: true });
  //     } else {
  //       setSelectedMenuId(null);
  //     }
  //   };

  //   const fetchMenus = async () => {
  //     if (userId) {
  //       try {
  //         // 方式一: 用startTransition 保持畫面流暢
  //         startTransition(() => {
  //           getAllMenusByUserId(userId)
  //             .then((data) => {
  //               setDateAllMenu(data as MenuType[])
  //             })
  //             .catch((error) => {
  //               console.error('Error fetching menus:', error);
  //             });
  //             setSelectedMenuId(lastSelectedMenuId)
  //             setIsMenuOpen({ [lastSelectedMenuId as string]: true })
  //         });

  //         // 方式二: 直接使用
  //         // const updatedMenus = await getAllMenusByUserId(userId);
  //         // setDateAllMenu(updatedMenus as MenuType[]);
  //       } catch (error) {
  //         console.error('Error fetching menus:', error);
  //       }
  //     } else {
  //       handleLocalMenuSelection(lastSelectedMenuId as string);
  //     }
  //   };

  //   fetchMenus();
  // }, [menus, setDateAllMenu, userId]);


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
    <div className='flex flex-col gap-5 relative'>
      {/* {pending && <Loader size={20} className="animate-spin absolute top-0 left-1/2" />} */}
      <MenuList
        menus={menusData?.length > 0 ? menusData : menus}
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
