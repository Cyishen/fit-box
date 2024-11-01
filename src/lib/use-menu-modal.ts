import { create } from "zustand";

type MenuModalState = {
  isOpen: boolean;
  id: string | null;
  open: (id: string) => void;
  close: () => void;
};

export const useMenuModal = create<MenuModalState>((set) => ({
  isOpen: false,
  id: null,
  open: (id: string) => set({ isOpen: true, id: id }),
  close: () => set({ isOpen: false, id: null }),
}));
