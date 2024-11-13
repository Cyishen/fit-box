import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'


// 菜單
interface BoxStore {
  menus: MenuType[];
  addMenu: (box: MenuType) => void;
  removeMenu: (id: string) => void;
  editMenu: (id: string, updatedMenu: MenuType) => void;
}

export const useMenuStore = create<BoxStore>()(
  persist(
    (set) => ({
      menus: [],
      addMenu: (box) =>
        set((state) => ({
          menus: [box, ...state.menus],
        })),
      removeMenu: (id) =>
        set((state) => ({
          menus: state.menus.filter(box => box.id !== id),
        })),
      editMenu: (id, updatedMenu) =>
        set((state) => ({
          menus: state.menus.map(menu => menu.id === id
            ? updatedMenu
            : menu
          ),
        })),
    }),
    {
      name: 'menu-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 模板
interface TemplateStore {
  templates: TemplateType[];
  addTemplate: (work: TemplateType) => void;
  removeTemplate: (id: string) => void;
  editTemplate: (id: string, updatedTemplate: TemplateType) => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      templates: [],
      addTemplate: (work) =>
        set((state) => ({
          templates: [...state.templates, work],
        })),

      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter(work => work.templateId !== id),
        })),

      editTemplate: (id, updatedTemplate) =>
        set((state) => ({
          templates: state.templates.map(template => template.templateId === id
            ? updatedTemplate
            : template
          ),
        })),
    }),
    {
      name: 'template-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// 訓練卡
interface WorkoutStore {
  workoutSessions: WorkoutSessionType[];
  addWorkoutSession: (session: WorkoutSessionType) => void;
  removeWorkoutSession: (id: string) => void;
  editWorkoutSession: (id: string, updatedSession: WorkoutSessionType) => void;
  removerAllWorkoutSessions: () => void;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set) => ({
      workoutSessions: [],
      addWorkoutSession: (session) =>
        set((state) => ({
          workoutSessions: [...state.workoutSessions, session]
        })),
      removeWorkoutSession: (id) =>
        set((state) => ({
          workoutSessions: state.workoutSessions.filter(session => session.cardSessionId !== id),
        })),
      editWorkoutSession: (id, updatedSession) =>
        set((state) => ({
          workoutSessions: state.workoutSessions.map(session => session.cardSessionId === id
            ? updatedSession
            : session
          ),
        })),
      removerAllWorkoutSessions: () =>
        set(() => ({
          workoutSessions: [],
        })),
    }),
    {
      name: 'workout-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);


// type UserModelStore = {
//   user: UserModelType;
//   setUser: (newUser: UserModelType) => void;
// }

// export const useUserStore = create<UserModelStore>()(
//   persist(
//     (set) => ({
//       user: {
//         userId: "Guest",
//         workoutSessions: [],
//       } as UserModelType,
//       setUser: (newUser: UserModelType) => set({ user: newUser }),
//     }),
//     {
//       name: 'user-storage',
//       storage: createJSONStorage(() => localStorage)
//     }
//   )
// );

