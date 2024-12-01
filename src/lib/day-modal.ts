import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'


type DayCardStore = {
  dayCard: WorkoutSessionType[];
  setDayCard: (data: WorkoutSessionType) => void;
  editDayCard: (id: string, updatedCard: WorkoutSessionType) => void;
  removeDayCard: (id: string) => void;
  setAllDayCard: (data: WorkoutSessionType[]) => void;
};

export const useDayCardStore = create<DayCardStore>()(
  persist(
    (set) => ({
      dayCard: [],
      // 1. 篩選資料庫卡片, 但本地沒有的卡片
      setAllDayCard: (data) =>
        set((state) => {
          const dbCardIds = data.map(card => card.cardSessionId);

          const newCards = data.filter(
            (newCard) => !state.dayCard.some((existingCard) => existingCard.cardSessionId === newCard.cardSessionId)
          );
      
          const updatedCards = state.dayCard.filter(
            (existingCard) => dbCardIds.includes(existingCard.cardSessionId)
          );
          return {
            dayCard: [...updatedCards, ...newCards],
          };
        }),

      // 2. 傳遞單個特定cardSessionId
      setDayCard: (data) =>
        set((state) => ({
          dayCard: state.dayCard.find(session => session.cardSessionId === data.cardSessionId)
            ? state.dayCard
            : [...state.dayCard, data],
        })),
      editDayCard: (id, updatedCard) =>
        set((state) => ({
          dayCard: state.dayCard.map(card => card.cardSessionId === id
            ? updatedCard
            : card
          ),
        })),
      removeDayCard: (id) =>
        set((state) => ({
          dayCard: state.dayCard.filter(session => session.cardSessionId !== id),
        })),
    }),
    {
      name: 'day-card-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);