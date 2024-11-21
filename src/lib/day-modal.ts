import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'


type DayCardStore = {
  dayCard: WorkoutSessionType[];
  setDayCard: (data: WorkoutSessionType[]) => void;
  editDayCard: (id: string, updatedCard: WorkoutSessionType) => void;
};

export const useDayCardStore = create<DayCardStore>()(
  persist(
    (set) => ({
      dayCard: [],
      setDayCard: (data) =>
        set({ dayCard: data }),
      editDayCard: (id, updatedCard) =>
        set((state) => ({
          dayCard: state.dayCard.map(card => card.cardSessionId === id
            ? updatedCard
            : card
          ),
        })),
    }),
    {
      name: 'day-card-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);