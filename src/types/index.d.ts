type MenuType = {
  id: string;
  userId: string;
  title: string;
};

// 模板定義
type TemplateType = {
  id?: string;
  userId?: string;
  menuId: string;
  templateId?: string;
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

  sortOrder?: number;

  templateSets: TemplateSetType[];
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
  menuId: string;
  templateId: string;
  templateTitle: string;

  date: string | Date;
  createdAt: string | Date;
  startTime: string | null;
  endTime: string | null;

  notes: string | null; 

  exercises: WorkoutExerciseType[];
};

type WorkoutExerciseType = {
  id?: string;
  movementId: string; // 動作ID，例如啞鈴胸推 "1"
  name: string; // 動作名稱，例如 "啞鈴胸推"
  exerciseCategory: string; // 動作類別

  sets: WorkoutSetType[];
  workoutSessionId: string;
};

type WorkoutSetType = {
  id: string;
  movementId: string;
  leftWeight: number; 
  rightWeight: number; 
  repetitions: number; 
  totalWeight: number;
};


// declare type UserModelType = {
//   userId: string;                  
//   email?: string;                               
//   name?: string;
//   image?: string;                    
//   dateOfBirth?: string;            
//   workoutSessions?: WorkoutSessionType[]; 
//   createdAt?: string;
//   updatedAt?: string;
//   lastActiveDate?: string;
// };
