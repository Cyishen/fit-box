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
  { movementId: '1', name: '啞鈴胸推', templateSets: [], exerciseCategory: '胸', sortOrder: 1, iconSrc:"/action-imgs/chest-up.png" },
  { movementId: '2', name: '器械飛鳥夾胸', templateSets: [], exerciseCategory: '胸', sortOrder: 2, iconSrc:"/action-imgs/bird-chest.png" },
  { movementId: '3', name: '上斜平躺臥推', templateSets: [], exerciseCategory: '胸', sortOrder: 3, iconSrc:"/action-imgs/incline-chest.png" },
  { movementId: '4', name: '深蹲', templateSets: [], exerciseCategory: '腿', sortOrder: 4, iconSrc:"/action-imgs/squat.png" },
  { movementId: '5', name: '側平舉', templateSets: [], exerciseCategory: '肩', sortOrder: 5, iconSrc:"/action-imgs/lateral-raise.png" },
  { movementId: '6', name: '器械側平舉', templateSets: [], exerciseCategory: '肩', sortOrder: 6, iconSrc:"/action-imgs/lateral-raise.png" },
  { movementId: '7', name: '肩推', templateSets: [], exerciseCategory: '肩', sortOrder: 7, iconSrc:"/action-imgs/push-up.png" },
  { movementId: '8', name: '悍馬機下拉', templateSets: [], exerciseCategory: '背', sortOrder: 8, iconSrc:"/action-imgs/lat-pull-down.png" },
  { movementId: '9', name: '器械划船', templateSets: [], exerciseCategory: '背', sortOrder: 9, iconSrc:"/action-imgs/seat-row.png" },
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
  { movementId: '1', name: '啞鈴胸推', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/chest-up.png" },
  { movementId: '2', name: '器械飛鳥夾胸', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/bird-chest.png" },
  { movementId: '3', name: '上斜平躺臥推', sets: [], exerciseCategory: '胸', workoutSessionId: '', iconSrc:"/action-imgs/incline-chest.png" },
  { movementId: '4', name: '深蹲', sets: [], exerciseCategory: '腿', workoutSessionId: '', iconSrc:"/action-imgs/squat.png" },
  { movementId: '5', name: '側平舉', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/lateral-raise.png" },
  { movementId: '6', name: '器械側平舉', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/lateral-raise.png" },
  { movementId: '7', name: '肩推', sets: [], exerciseCategory: '肩', workoutSessionId: '', iconSrc:"/action-imgs/push-up.png" },
  { movementId: '8', name: '悍馬機下拉', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/lat-pull-down.png" },
  { movementId: '9', name: '器械划船', sets: [], exerciseCategory: '背', workoutSessionId: '', iconSrc:"/action-imgs/seat-row.png" },
];