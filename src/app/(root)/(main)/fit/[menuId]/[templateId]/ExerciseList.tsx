import React, { useState } from 'react';
import { TemplateType } from './TemplateForm';
import { useRouter } from 'next/navigation';
import { useTemplateStore } from '@/lib/store';
import { CopyPlus } from 'lucide-react';
import ExerciseListCard from './ExerciseListCard';


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

type ExerciseListProps = {
  exercises: Exercise[];
  template: TemplateType;
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
};

const ExerciseList = ({ exercises, setTemplateState, template }: ExerciseListProps) => {
  const router = useRouter();

  // openCardId 狀態控制
  const [openExerciseId, setOpenExerciseId] = useState<string | null>(null);
  const handleToggleExercise = (exerciseId: string) => {
    setOpenExerciseId((prev) => (prev === exerciseId ? null : exerciseId));
  };

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

  const handleUpdateSets = (exerciseId: string, updatedSets: Set[]) => {
    const updatedExercises = exercises.map((exercise) =>
      exercise.ExerciseId === exerciseId
        ? { ...exercise, sets: updatedSets }
        : exercise
    );

    const updatedTemplate: TemplateType = {
      ...template,
      exercises: updatedExercises,
    };

    updateTemplate(template.cardId, updatedTemplate);
    setTemplateState(updatedTemplate);
  };


  return (
    <div>
      <div className='flex justify-between items-center px-4'>
        <h3 className="font-bold">添加動作</h3>

        <button
          type="button"
          onClick={() => router.push(`/fit/${template.menuId}/${template.cardId}/create-template/exercise-picker`)}
          className='w-10 h-10 flex justify-center items-center duration-300 rounded-full bg-[#66CCFF] hover:brightness-110'
        >
          <div className='w-full h-full rounded-full flex justify-center items-center hover:invert'>
            <CopyPlus className='w-5' />
          </div>
        </button>
      </div>

      <div className='mt-3 px-3 rounded-t-2xl sm:rounded-2xl bg-slate-200'>
        <div className='pt-3'>
          <div className='overflow-y-scroll max-h-[500px] min-h-[500px]'>
            <div className='flex flex-col gap-3 pb-20'>
              {exercises.map((exercise) => (
                <ExerciseListCard
                  key={exercise.ExerciseId}
                  exercise={exercise}
                  handleRemoveExercise={handleRemoveExercise}
                  onUpdateSets={handleUpdateSets}
                  isOpen={openExerciseId === exercise.ExerciseId}
                  onToggle={() => handleToggleExercise(exercise.ExerciseId)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;
