import { CommentType } from '@/app/(root)/(main)/post/DCard';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'


// 菜單
interface CommentStore {
  comments: CommentType[]
  addComment: (com: CommentType) => void;
  setComments: (com: CommentType[]) => void
}

export const useCommentStore = create<CommentStore>()(
  persist(
    (set) => ({
      comments: [],
      addComment: (com) =>
        set((state) => ({
          comments: [...state.comments, com],
        })),
      setComments: (com) =>
        set({ comments: com })
    }),
    {
      name: 'comment-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);