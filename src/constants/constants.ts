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
  templateId?: string;
  movementId: string; // 動作ID，例如啞鈴胸推 "1"
  name: string; // 動作名稱，例如 "啞鈴胸推"
  exerciseCategory: string; // 動作類別
  iconSrc?: string;
  sortOrder?: number;

  templateSets: TemplateSetType[];
}

export const exerciseTemplates: TemplateExerciseType[] = [
  { movementId: '1', name: '槓鈴臥推', templateSets: [], exerciseCategory: '胸', sortOrder: 1, iconSrc:"/action-imgs/chest/chest_Barbell-Bench-Press.png" },
  { movementId: '2', name: '啞鈴臥推', templateSets: [], exerciseCategory: '胸', sortOrder: 2, iconSrc:"/action-imgs/chest/chest_dumbbell-press.png" },
  { movementId: '3', name: '上斜啞鈴臥推', templateSets: [], exerciseCategory: '胸', sortOrder: 3, iconSrc:"/action-imgs/chest/chest_Incline-Dumbbell-Press.png" },
  { movementId: '4', name: '飛鳥夾胸', templateSets: [], exerciseCategory: '胸', sortOrder: 4, iconSrc:"/action-imgs/chest/chest_pec-deck-fly.png" },
  { movementId: '5', name: '上斜臥推機', templateSets: [], exerciseCategory: '胸', sortOrder: 5, iconSrc:"/action-imgs//chest/chest_Lever-Incline-Chest-Press.png" },
  { movementId: '6', name: '坐姿胸推', templateSets: [], exerciseCategory: '胸', sortOrder: 6, iconSrc:"/action-imgs//chest/chest_Inner-Chest-Press-Machine.png" },
  { movementId: '7', name: '滑輪下拉', templateSets: [], exerciseCategory: '背', sortOrder: 7, iconSrc:"/action-imgs/back/back_Lat-Pulldown.png" },
  { movementId: '8', name: '坐姿划船', templateSets: [], exerciseCategory: '背', sortOrder: 8, iconSrc:"/action-imgs/back/back_Seated-Cable-Row.png" },
  { movementId: '9', name: '器械划船', templateSets: [], exerciseCategory: '背', sortOrder: 9, iconSrc:"/action-imgs/back/back_Plate-Loaded-Seated-Row.png" },
  { movementId: '10', name: '槓桿高划船', templateSets: [], exerciseCategory: '背', sortOrder: 10, iconSrc:"/action-imgs/back/back_Lever-High-Row.png" },
  { movementId: '11', name: '直背下拉', templateSets: [], exerciseCategory: '背', sortOrder: 11, iconSrc:"/action-imgs/back/back_Rope-Straight-Arm-Pulldown.png" },
  { movementId: '12', name: '輔助引體向上', templateSets: [], exerciseCategory: '背', sortOrder: 12, iconSrc:"/action-imgs/back/back_Assisted-Pull-up.png" },
  { movementId: '13', name: '肩推', templateSets: [], exerciseCategory: '肩', sortOrder: 13, iconSrc:"/action-imgs/shoulder/shoulder_Dumbbell-Shoulder-Press.png" },
  { movementId: '14', name: '側平舉', templateSets: [], exerciseCategory: '肩', sortOrder: 14, iconSrc:"/action-imgs/shoulder/shoulder_Dumbbell-Lateral-Raise.png" },
  { movementId: '15', name: '前平舉', templateSets: [], exerciseCategory: '肩', sortOrder: 15, iconSrc:"/action-imgs/shoulder/shoulder_Alternating-Dumbbell-Front-Raise.png" },
  { movementId: '16', name: '坐姿飛鳥', templateSets: [], exerciseCategory: '肩', sortOrder: 16, iconSrc:"/action-imgs/shoulder/shoulder_Seated-Rear-Lateral-Dumbbell-Raise.png" },
  { movementId: '17', name: '面拉', templateSets: [], exerciseCategory: '肩', sortOrder: 17, iconSrc:"/action-imgs/shoulder/shoulder_Face-Pull.png" },
  { movementId: '18', name: '器械側平舉', templateSets: [], exerciseCategory: '肩', sortOrder: 18, iconSrc:"/action-imgs/shoulder/shoulder_Lateral-Raise-Machine.png" },
  { movementId: '19', name: '器械肩推', templateSets: [], exerciseCategory: '肩', sortOrder: 19, iconSrc:"/action-imgs/shoulder/shoulder_Lever-Shoulder-Press.png" },
  { movementId: '20', name: '反向飛鳥', templateSets: [], exerciseCategory: '肩', sortOrder: 20, iconSrc:"/action-imgs/shoulder/shoulder_Rear-Delt-Machine-Flys.png" },
  { movementId: '21', name: '深蹲', templateSets: [], exerciseCategory: '腿', sortOrder: 21, iconSrc:"/action-imgs/leg/leg_BARBELL-SQUAT.png" },
  { movementId: '22', name: '史密斯深蹲', templateSets: [], exerciseCategory: '腿', sortOrder: 22, iconSrc:"/action-imgs/leg/leg_smith-machine-squat.png" },
  { movementId: '23', name: '反向哈克深蹲', templateSets: [], exerciseCategory: '腿', sortOrder: 23, iconSrc:"/action-imgs/leg/leg_Reverse-Hack-Squat.png" },
  { movementId: '24', name: '羅馬硬舉', templateSets: [], exerciseCategory: '腿', sortOrder: 24, iconSrc:"/action-imgs/leg/leg_Barbell-Romanian-Deadlift.png" },
  { movementId: '25', name: '腿推', templateSets: [], exerciseCategory: '腿', sortOrder: 25, iconSrc:"/action-imgs/leg/leg_Leg-Press.png" },
  { movementId: '26', name: '立式跪腿彎舉', templateSets: [], exerciseCategory: '腿', sortOrder: 26, iconSrc:"/action-imgs/leg/leg_Lever-Kneeling-Leg-Curl.png" },
  { movementId: '27', name: '雙腿伸屈', templateSets: [], exerciseCategory: '腿', sortOrder: 27, iconSrc:"/action-imgs/leg/leg_LEG-EXTENSION.png" },
  { movementId: '28', name: '大腿內收外展訓練', templateSets: [], exerciseCategory: '腿', sortOrder: 28, iconSrc:"/action-imgs/leg/leg_HiP-ABDUCTION-MACHINE.png" },
];

type WorkoutExerciseType = {
  id?: string;
  workoutSessionId?: string;
  movementId: string;
  name: string; 
  exerciseCategory: string; 

  sets: WorkoutSetType[];
  iconSrc?: string;
};

export const exerciseWorkouts: WorkoutExerciseType[] = [
  { movementId: '1', name: '槓鈴臥推', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/chest/chest_Barbell-Bench-Press.png" },
  { movementId: '2', name: '啞鈴臥推', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/chest/chest_dumbbell-press.png" },
  { movementId: '3', name: '上斜啞鈴臥推', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/chest/chest_Incline-Dumbbell-Press.png" },
  { movementId: '4', name: '飛鳥夾胸', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/chest/chest_pec-deck-fly.png" },
  { movementId: '5', name: '上斜臥推機', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs//chest/chest_Lever-Incline-Chest-Press.png" },
  { movementId: '6', name: '坐姿胸推', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs//chest/chest_Inner-Chest-Press-Machine.png" },
  { movementId: '7', name: '滑輪下拉', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/back/back_Lat-Pulldown.png" },
  { movementId: '8', name: '坐姿划船', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/back/back_Seated-Cable-Row.png" },
  { movementId: '9', name: '器械划船', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/back/back_Plate-Loaded-Seated-Row.png" },
  { movementId: '10', name: '槓桿高划船', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/back/back_Lever-High-Row.png" },
  { movementId: '11', name: '直背下拉', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/back/back_Rope-Straight-Arm-Pulldown.png" },
  { movementId: '12', name: '輔助引體向上', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/back/back_Assisted-Pull-up.png" },
  { movementId: '13', name: '肩推', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder/shoulder_Dumbbell-Shoulder-Press.png" },
  { movementId: '14', name: '側平舉', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder/shoulder_Dumbbell-Lateral-Raise.png" },
  { movementId: '15', name: '前平舉', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder/shoulder_Alternating-Dumbbell-Front-Raise.png" },
  { movementId: '16', name: '坐姿飛鳥', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder/shoulder_Seated-Rear-Lateral-Dumbbell-Raise.png" },
  { movementId: '17', name: '面拉', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder/shoulder_Face-Pull.png" },
  { movementId: '18', name: '器械側平舉', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder/shoulder_Lateral-Raise-Machine.png" },
  { movementId: '19', name: '器械肩推', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder/shoulder_Lever-Shoulder-Press.png" },
  { movementId: '20', name: '反向飛鳥', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/shoulder/shoulder_Rear-Delt-Machine-Flys.png" },
  { movementId: '21', name: '深蹲', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/leg/leg_BARBELL-SQUAT.png" },
  { movementId: '22', name: '史密斯深蹲', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/leg/leg_smith-machine-squat.png" },
  { movementId: '23', name: '反向哈克深蹲', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/leg/leg_Reverse-Hack-Squat.png" },
  { movementId: '24', name: '羅馬硬舉', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/leg/leg_Barbell-Romanian-Deadlift.png" },
  { movementId: '25', name: '腿推', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/leg/leg_Leg-Press.png" },
  { movementId: '26', name: '立式跪腿彎舉', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/leg/leg_Lever-Kneeling-Leg-Curl.png" },
  { movementId: '27', name: '雙腿伸屈', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/leg/leg_LEG-EXTENSION.png" },
  { movementId: '28', name: '大腿內收外展訓練', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/leg/leg_HiP-ABDUCTION-MACHINE.png" },
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