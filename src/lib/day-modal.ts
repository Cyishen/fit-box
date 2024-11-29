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
      // 1.傳遞整個陣列
      setAllDayCard: (data) =>
        set((state) => {
          const dbCardIds = data.map(card => card.cardSessionId);

          // 檢查資料庫卡片列表中的每個卡片
          const newCards = data.filter(
            (newCard) => !state.dayCard.some((existingCard) => existingCard.cardSessionId === newCard.cardSessionId)
          );

          // 刪除本地中在資料庫中已經不存在的卡片
          const updatedCards = state.dayCard.filter(
            (existingCard) => dbCardIds.includes(existingCard.cardSessionId)
          );
          return {
            dayCard: [...updatedCards, ...newCards],
          };
        }),
      // 2.傳遞單個
      // setDayCard: (data) =>
      //   set((state) => ({
      //     dayCard: [...state.dayCard, data]
      //   })),
      // 3.篩選cardSessionId
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