import React from 'react';
import { TemplateType } from './TemplateForm';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTemplateStore } from '@/lib/store';


export type Exercise = {
  ExerciseId: string; // 唯一識別符
  name: string; // 動作名稱，例如 "啞鈴胸推"
  sets: Set[]; // 包含此動作的組
};

export type Set = {
  leftWeight: number; // 左邊的重量
  right邊的重量: number; // 右邊的重量
  repetitions: number; // 做的次數
  totalWeight: number; // 此組的總重量（左重量 + 右重量 * 做的次數）
};

type ExerciseListProps = {
  exercises: Exercise[];
  template: TemplateType;
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
};

const ExerciseList = ({ exercises, setTemplateState, template }: ExerciseListProps) => {
  const router = useRouter();

  const updateTemplate = useTemplateStore(state => state.editTemplate);

  const handleRemoveExercise = (exerciseId: string) => {
    const updatedExercises = exercises.filter((exercise) => exercise.ExerciseId !== exerciseId);
    const updatedTemplate: TemplateType = {
      ...template,
      exercises: updatedExercises,
    };

    updateTemplate(template.cardId, updatedTemplate);

    setTemplateState(updatedTemplate);
  };

  return (
    <div>
      <div className='flex justify-between'>
        <h3 className="font-bold">添加動作</h3>

        <button
          type="button"
          onClick={() => router.push(`/fit/${template.menuId}/${template.cardId}/create-template/exercise-picker`)}
          className='font-bold rounded-full bg-white text-sm w-10 h-10 text-center'
        >
          +
        </button>
      </div>

      <div className='h-[300px] bg-white rounded-lg mt-2 overflow-y-scroll'>
        <div className='flex flex-col gap-1'>
          {exercises.map((exercise) => (
            <div key={exercise.ExerciseId} className="flex items-center justify-between gap-3">
              <h4>{exercise.name}</h4>
              <Button
                variant='destructive'
                size='sm'
                type='button'
                onClick={() => handleRemoveExercise(exercise.ExerciseId)}
              >
                刪除
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;
