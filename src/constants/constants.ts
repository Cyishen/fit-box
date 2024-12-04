export const sideCategory = [
  { label: "胸", icon: "/icons/dumbbell.svg", },
  { label: "背", icon: "/icons/dumbbell.svg", },
  { label: "肩", icon: "/icons/shoulder.svg", },
  { label: "腿", icon: "/icons/leg.svg", },
  { label: "二頭", icon: "/icons/dumbbell.svg", },
  { label: "三頭", icon: "/icons/dumbbell.svg", },
]

type TemplateExerciseType = {
  id?: string;
  templateId?: string
  movementId: string; // 動作ID，例如啞鈴胸推 "1"
  name: string; // 動作名稱，例如 "啞鈴胸推"
  exerciseCategory: string; // 動作類別
  iconSrc?: string
  sortOrder?: number;

  templateSets: TemplateSetType[];
}

export const exerciseTemplates: TemplateExerciseType[] = [
  { movementId: '1', name: '啞鈴胸推', templateSets: [], exerciseCategory: '胸', sortOrder: 1, iconSrc:"/action-imgs/chest_chest-up.png" },
  { movementId: '2', name: '器械飛鳥夾胸', templateSets: [], exerciseCategory: '胸', sortOrder: 2, iconSrc:"/action-imgs/chest_bird-chest.png" },
  { movementId: '3', name: '上斜平躺臥推', templateSets: [], exerciseCategory: '胸', sortOrder: 3, iconSrc:"/action-imgs/chest_incline-chest.png" },
  { movementId: '4', name: '深蹲', templateSets: [], exerciseCategory: '腿', sortOrder: 4, iconSrc:"/action-imgs/leg_squat.png" },
  { movementId: '5', name: '側平舉', templateSets: [], exerciseCategory: '肩', sortOrder: 5, iconSrc:"/action-imgs/shoulder_lateral-raise.png" },
  { movementId: '6', name: '器械側平舉', templateSets: [], exerciseCategory: '肩', sortOrder: 6, iconSrc:"/action-imgs/shoulder_lateral-raise.png" },
  { movementId: '7', name: '肩推', templateSets: [], exerciseCategory: '肩', sortOrder: 7, iconSrc:"/action-imgs/shoulder_push-up.png" },
  { movementId: '8', name: '悍馬機下拉', templateSets: [], exerciseCategory: '背', sortOrder: 8, iconSrc:"/action-imgs/back_lat-pull-down.png" },
  { movementId: '9', name: '器械划船', templateSets: [], exerciseCategory: '背', sortOrder: 9, iconSrc:"/action-imgs/back_seat-row.png" },
];

type WorkoutExerciseType = {
  id?: string;
  workoutSessionId?: string;
  movementId: string; // 動作ID，例如啞鈴胸推 "1"
  name: string; // 動作名稱，例如 "啞鈴胸推"
  exerciseCategory: string; // 動作類別，例如 "胸"

  sets: WorkoutSetType[];
  iconSrc?: string
};

export const exerciseWorkouts: WorkoutExerciseType[] = [
  { movementId: '1', name: '啞鈴胸推', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/chest_chest-up.png" },
  { movementId: '2', name: '器械飛鳥夾胸', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/chest_bird-chest.png" },
  { movementId: '3', name: '上斜平躺臥推', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/chest_incline-chest.png" },
  { movementId: '4', name: '深蹲', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/leg_squat.png" },
  { movementId: '5', name: '側平舉', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder_lateral-raise.png" },
  { movementId: '6', name: '器械側平舉', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder_lateral-raise.png" },
  { movementId: '7', name: '肩推', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder_push-up.png" },
  { movementId: '8', name: '悍馬機下拉', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/back_lat-pull-down.png" },
  { movementId: '9', name: '器械划船', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/back_seat-row.png" },
];


// TODO barChart模擬資料
export const workoutSessions = [
  {
    sessionId: "1",
    date: "2024-11-19", // 當週（週二）胸2 背2
    exercises: [
      {
        exerciseCategory: "胸",
        sets: [
          { isCompleted: true },
          { isCompleted: true },
          { isCompleted: false },
        ],
      },
      {
        exerciseCategory: "背",
        sets: [
          { isCompleted: true },
          { isCompleted: true },
        ],
      },
    ],
  },
  {
    sessionId: "2",
    date: "2024-11-18", // 當週（週一）腿1 (本週統計: 胸2 背2 腿1)
    exercises: [
      {
        exerciseCategory: "腿",
        sets: [
          { isCompleted: true },
          { isCompleted: false },
        ],
      },
    ],
  },
  {
    sessionId: "3",
    date: "2024-11-17", //上週日 胸1 (本月統計: 胸3 背2 腿1)
    exercises: [
      {
        exerciseCategory: "胸",
        sets: [
          { isCompleted: true },
          { isCompleted: false },
        ],
      },
    ],
  },
  {
    sessionId: "4",
    date: "2024-10-25", // 上個月 胸2 背1 
    exercises: [
      {
        exerciseCategory: "胸",
        sets: [
          { isCompleted: true },
          { isCompleted: true },
        ],
      },
      {
        exerciseCategory: "背",
        sets: [
          { isCompleted: false },
          { isCompleted: true },
        ],
      },
    ],
  },
  {
    sessionId: "5",
    date: "2024-09-15", // 更早的月 腿2 (本年統計: 胸5 背3 腿3)
    exercises: [
      {
        exerciseCategory: "腿",
        sets: [
          { isCompleted: true },
          { isCompleted: true },
          { isCompleted: false },
        ],
      },
    ],
  },
  {
    sessionId: "5",
    date: "2023-02-15", // 去年 腿2
    exercises: [
      {
        exerciseCategory: "腿",
        sets: [
          { isCompleted: true },
          { isCompleted: true },
          { isCompleted: false },
        ],
      },
    ],
  },
  {
    sessionId: "6",
    date: "2023-06-14", // 去年 (本年統計: 腿2 背1 二頭2)
    exercises: [
      {
        exerciseCategory: "背",
        sets: [
          { isCompleted: true },
          { isCompleted: false },
        ],
      },
      {
        exerciseCategory: "二頭",
        sets: [
          { isCompleted: true },
          { isCompleted: true },
        ],
      },
    ],
  },
];