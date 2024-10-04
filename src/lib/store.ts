import { TemplateType } from '@/app/(root)/(main)/fit/[menuId]/[templateId]/TemplateForm';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

interface TemplateStore {
  templates: TemplateType[];
  addTemplate: (work: TemplateType) => void;
  removeTemplate: (id: string) => void;
  editTemplate: (id: string, updatedTemplate: TemplateType) => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      templates: [],
      addTemplate: (work) =>
        set((state) => ({
          templates: [...state.templates, work],
        })),

      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter(work => work.cardId !== id),
        })),

      editTemplate: (id, updatedTemplate) =>
        set((state) => ({
          templates: state.templates.map(template => template.cardId === id
            ? updatedTemplate
            : template
          ),
        })),
    }),
    {
      name: 'work-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);


type MenuType = {
  menuId: string;
  title: string;
};

interface BoxStore {
  menus: MenuType[];
  addMenu: (box: MenuType) => void;
  removeMenu: (id: string) => void;
  editMenu: (id: string, updatedMenu: MenuType ) => void;
}

export const useMenuStore = create<BoxStore>()(
  persist(
    (set) => ({
      menus: [],
      addMenu: (box) =>
        set((state) => ({
          menus: [box, ...state.menus ],
        })),
      removeMenu: (id) =>
        set((state) => ({
          menus: state.menus.filter(box => box.menuId !== id),
        })),
      editMenu: (id, updatedMenu) =>
        set((state) => ({
          menus: state.menus.map(menu => menu.menuId === id
            ? updatedMenu
            : menu
          ),
        })),
    }),
    {
      name: 'menu-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);