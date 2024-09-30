import React from 'react';
import { TemplateType } from './Form';

const exerciseTemplates: Exercise[] = [
  { ExerciseId: '1', name: '啞鈴胸推', sets: [] },
  { ExerciseId: '2', name: '深蹲', sets: [] },
];

export type Exercise = {
  ExerciseId: string; // 唯一識別符
  name: string; // 動作名稱，例如 "啞鈴胸推"
  sets: Set[]; // 包含此動作的組
};

export type Set = {
  leftWeight: number; // 左邊的重量
  rightWeight: number; // 右邊的重量
  repetitions: number; // 做的次數
  totalWeight: number; // 此組的總重量（左重量 + 右重量 * 做的次數）
};

type WeightTrainingProps = {
  exercises: Exercise[];
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
};

const WeightTraining = ({ exercises, setTemplateState }: WeightTrainingProps) => {
  const handleAddExercise = (exercise: Exercise) => {
    setTemplateState((prevTemplate) => ({
      ...prevTemplate,
      exercises: [...(prevTemplate.exercises || []), exercise],
    }));
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setTemplateState((prevTemplate) => ({
      ...prevTemplate,
      exercises: prevTemplate.exercises?.filter((exercise) => 
        exercise.ExerciseId !== exerciseId) || [],
    }));
  };

  return (
    <div>
      <h3 className="font-bold">添加動作</h3>
      {exerciseTemplates.map((template) => (
        <button
          key={template.ExerciseId}
          type="button"
          onClick={() => handleAddExercise(template)}
          className="bg-blue-500 text-white p-2 rounded m-2"
        >
          {template.name}
        </button>
      ))}

      <div>
        {exercises.map((exercise) => (
          <div key={exercise.ExerciseId} className="flex items-center justify-between">
            <h4>{exercise.name}</h4>
            <button
              onClick={() => handleRemoveExercise(exercise.ExerciseId)}
              className="bg-red-500 text-white p-1 rounded"
            >
              刪除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeightTraining;
