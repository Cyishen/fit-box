import { create } from "zustand";

type PracticeModalState = {
  isOpen: boolean;
  menuId: string | null;
  templateId: string | null;
  open: (menuId: string, templateId: string) => void;
  close: () => void;
};

export const usePracticeModal = create<PracticeModalState>((set) => ({
  isOpen: false,
  menuId: null,
  templateId: null,
  open: (menuId: string, templateId: string) => set({ isOpen: true, menuId, templateId }),
  close: () => set({ isOpen: false, menuId: null, templateId: null }),
}));
