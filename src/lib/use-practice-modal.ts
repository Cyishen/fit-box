import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'


type PracticeModalState = {
  isOpen: boolean;
  menuId: string | null;
  templateId: string | null;
  open: (menuId: string, templateId: string) => void;
  close: () => void;

  dataAllTemplate: TemplateType[];
  setDataAllTemplate: (data: TemplateType[]) => void;
  clearStoredData: () => void;
};


export const usePracticeModal = create<PracticeModalState>()(
  persist(
    (set) => ({
      isOpen: false,
      menuId: null,
      templateId: null,
      open: (menuId: string, templateId: string) =>
        set({ isOpen: true, menuId, templateId }),
      close: () =>
        set({ isOpen: false, menuId: null, templateId: null }),

      dataAllTemplate: [],
      setDataAllTemplate: (data) =>
        set({ dataAllTemplate: data }),

      clearStoredData: () => {
        set({ dataAllTemplate: [] });
        localStorage.removeItem('from-data-template-storage');
      },
    }),
    {
      name: 'from-data-template-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        dataAllTemplate: state.dataAllTemplate,
      }),
    }
  )
);
