declare type UserModelType = {
  userId: string;                  
  email?: string;                               
  name?: string;
  image?: string;                    
  dateOfBirth?: string;            
  workoutSessions?: WorkoutSessionType[]; 
  createdAt?: string;
  updatedAt?: string;
  lastActiveDate?: string;
};

// TODO: 用戶每天的訓練紀錄
type WorkoutSessionType = {
  cardSessionId: string;
  userId: string;
  menuId: string;
  templateId: string;
  templateTitle: string;
  date: string;
  exercises: ExerciseType[];
  startTime?: string;     
  endTime?: string; 
  notes?: string; 
};

// 分割線 =========================== 分割線

type TemplateType = {
  userId?: string;
  menuId: string;
  templateId: string;
  templateCategory: string;
  templateTitle: string;
  exercises: ExerciseType[];
};

type MenuType = {
  id: string;
  userId: string;
  title: string;
};

type ExerciseType = {
  movementId: string; // 動作ID，例如啞鈴胸推 "1"
  name: string; // 動作名稱，例如 "啞鈴胸推"
  exerciseCategory?: string; // 動作類別
  sets: SetType[];
};

type SetType = {
  movementId?: string;
  leftWeight: number; 
  rightWeight: number; 
  repetitions: number; 
  totalWeight: number;
};
