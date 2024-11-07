import { create } from "zustand";

type MenuModalState = {
  isOpen: boolean;
  id: string | null;
  open: (id: string) => void;
  close: () => void;
  dataAllMenu: MenuType[];
  setDataAllMenu: (data: MenuType[]) => void;
};

export const useMenuModal = create<MenuModalState>()(
  (set) => ({
    isOpen: false,
    id: null,
    open: (id: string) => set({ isOpen: true, id: id }),
    close: () => set({ isOpen: false, id: null }),
    dataAllMenu: [],
    setDataAllMenu: (data: MenuType[]) => set({ dataAllMenu: data }),
  })
);