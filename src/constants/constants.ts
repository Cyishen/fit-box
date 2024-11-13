export const sideCategory = [
  { label: "胸", icon: "/icons/dumbbell.svg", },
  { label: "背", icon: "/icons/dumbbell.svg", },
  { label: "肩", icon: "/icons/shoulder.svg", },
  { label: "腿", icon: "/icons/leg.svg", },
  { label: "二頭", icon: "/icons/dumbbell.svg", },
  { label: "三頭", icon: "/icons/dumbbell.svg", },
]

export const exerciseTemplates: TemplateExerciseType[] = [
  { movementId: '1', name: '啞鈴胸推', templateSets: [], exerciseCategory: '胸', sortOrder: 1  },
  { movementId: '2', name: '深蹲', templateSets: [], exerciseCategory: '腿', sortOrder: 2  },
  { movementId: '3', name: '肩推', templateSets: [], exerciseCategory: '肩', sortOrder: 3  },
  { movementId: '4', name: '飛鳥', templateSets: [], exerciseCategory: '肩', sortOrder: 4 },
  { movementId: '5', name: '划船', templateSets: [], exerciseCategory: '背', sortOrder: 5  },
  { movementId: '6', name: '寬距下拉', templateSets: [], exerciseCategory: '背', sortOrder: 6  },
];

export const exerciseWorkouts: WorkoutExerciseType[] = [
  { movementId: '1', name: '啞鈴胸推', sets: [], exerciseCategory: '胸', workoutSessionId: '' },
  { movementId: '2', name: '深蹲', sets: [], exerciseCategory: '腿', workoutSessionId: '' },
  { movementId: '3', name: '肩推', sets: [], exerciseCategory: '肩', workoutSessionId: '' },
  { movementId: '4', name: '飛鳥', sets: [], exerciseCategory: '肩', workoutSessionId: ''},
  { movementId: '5', name: '划船', sets: [], exerciseCategory: '背', workoutSessionId: '' },
  { movementId: '6', name: '寬距下拉', sets: [], exerciseCategory: '背', workoutSessionId: '' },
];