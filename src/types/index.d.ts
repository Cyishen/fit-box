declare type User = {
  $id: string;
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  name: string;
  dateOfBirth: string;
};

type TemplateType = {
  cardId: string;
  category: string;
  title: string;
  menuId: string;
  exercises: ExerciseType[];
};

type MenuType = {
  menuId: string;
  title: string;
};


type ExerciseType = {
  ExerciseId: string; // 唯一識別符
  name: string; // 動作名稱，例如 "啞鈴胸推"
  sets: SetProps[]; // 包含此動作的組
};

type SetProps = {
  leftWeight: number; // 左邊的重量
  rightWeight: number; // 右邊的重量
  repetitions: number; // 做的次數
  totalWeight: number; // 此組的總重量（左重量 + 右重量 * 做的次數）
};
