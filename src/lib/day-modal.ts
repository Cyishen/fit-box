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
          console.log("Local cards before:", dbCardIds);
          // 找出本地不在資料庫的卡
          const cardsToRemove = state.dayCard.filter(
            (existingCard) => !dbCardIds.includes(existingCard.cardSessionId)
          );
          console.log("Cards not in DB:", cardsToRemove);
          // 篩選出數據庫有, 但本地沒有
          const newCards = data.filter(
            (newCard) => !state.dayCard.some((existingCard) => existingCard.cardSessionId === newCard.cardSessionId)
          );
          console.log("Cards from Db:", newCards);
          // 更新本地卡片：保留數據庫已有的卡片
          const updatedCards = state.dayCard.filter(
            (existingCard) => dbCardIds.includes(existingCard.cardSessionId)
          );
          console.log("updated local:", updatedCards);

          // 刪除本地卡片
          cardsToRemove.forEach((card) => {
            state.removeDayCard(card.cardSessionId);
          });

          return {
            dayCard: [...updatedCards, ...newCards],
          };
        }),    

      // setAllDayCard: (data) =>
      //   set(() => ({
      //     dayCard: data
      //   })),

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