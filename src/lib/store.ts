import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

type TemplateType = {
  cardId: string;
  category: string;
  title: string;
  menuId: string;
};

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
      // storage: createJSONStorage(() => sessionStorage),
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
    }),
    {
      name: 'menu-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);