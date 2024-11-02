import { create } from "zustand";

type DeleteModalState = {
  isOpen: boolean;
  id: string | null;
  openDelete: (id: string) => void;
  closeDelete: () => void;
};

export const useDeleteMenuModal = create<DeleteModalState>()((set) => ({
  isOpen: false,
  id: null,
  openDelete: (id: string) => set({ isOpen: true, id: id }),
  closeDelete: () => set({ isOpen: false, id: null }),
}));