declare type UserModel = {
  userId: string;                  
  email?: string;                   
  firstName?: string;               
  lastName?: string;              
  name?: string;                    
  dateOfBirth?: string;            
  workoutSessions?: WorkoutSessionType[]; 
};

// TODO: 用戶每天的訓練紀錄
type WorkoutSessionType = {
  sessionId: string;
  userId: string;
  menuId: string;
  date: string;
  exercises: ExerciseType[];
};

// 分割線 =========================== 分割線

type TemplateType = {
  userId?: string;
  cardId: string;
  category: string;
  title: string;
  menuId: string;
  exercises: ExerciseType[];
};

type MenuType = {
  userId?: string;
  menuId: string;
  title: string;
};

type ExerciseType = {
  exerciseId: string; // 動作ID，例如 "1"
  name: string; // 動作名稱，例如 "啞鈴胸推"
  sets: SetType[];
};

type SetType = {
  leftWeight: number; 
  rightWeight: number; 
  repetitions: number; 
  totalWeight: number;
};
