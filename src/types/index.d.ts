type MenuType = {
  id: string;
  userId: string;
  title: string;
};

// 模板定義
type TemplateType = {
  id: string;
  userId?: string;
  menuId: string;

  templateCategory: string;
  templateTitle: string;
  templateExercises: TemplateExerciseType[];
};

type TemplateExerciseType = {
  id?: string;
  templateId?: string
  movementId: string; // 動作ID，例如啞鈴胸推 "1"
  name: string; // 動作名稱，例如 "啞鈴胸推"
  exerciseCategory: string; // 動作類別
  templateSets: TemplateSetType[];

  sortOrder?: number;
  iconSrc?: string;
  isSingleWeight?: boolean;
}

type TemplateSetType = {
  id: string;
  movementId: string;
  leftWeight: number; 
  rightWeight: number; 
  repetitions: number; 
  totalWeight: number;

  sortOrder?: number;
}

// 訓練卡複製模板內容
type WorkoutSessionType = {
  id?: string;
  cardSessionId: string;
  userId: string;
  menuId?: string;
  templateId?: string;

  templateTitle: string;
  exercises: WorkoutExerciseType[];

  date: string | Date;
  createdAt: string | Date;
  startTime: string | null;
  endTime: string | null;

  notes: string | null; 

  isSynced?: boolean;
};

type WorkoutExerciseType = {
  id?: string;
  workoutSessionId?: string;
  movementId: string; // 動作ID，例如啞鈴胸推 "1"
  name: string; // 動作名稱，例如 "啞鈴胸推"
  exerciseCategory: string; // 動作類別，例如 "胸"
  sets: WorkoutSetType[];

  isSingleWeight?: boolean;
};

type WorkoutSetType = {
  id: string;
  movementId: string;
  leftWeight: number; 
  rightWeight: number; 
  repetitions: number; 
  totalWeight: number;

  isCompleted?: boolean;
};
