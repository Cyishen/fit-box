import { create } from "zustand";

type MenuModalState = {
  isOpen: boolean;
  menuId: string | null;
  open: (menuId: string) => void;
  close: () => void;
};

export const useMenuModal = create<MenuModalState>((set) => ({
  isOpen: false,
  menuId: null,
  open: (menuId: string) => set({ isOpen: true, menuId }),
  close: () => set({ isOpen: false, menuId: null }),
}));
