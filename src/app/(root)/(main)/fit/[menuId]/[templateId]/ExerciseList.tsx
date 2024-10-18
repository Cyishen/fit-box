import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplateStore } from '@/lib/store';
import { CopyPlus } from 'lucide-react';
import ExerciseListCard from './ExerciseListCard';


type ExerciseListProps = {
  exercises: ExerciseType[];
  template: TemplateType;
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
};

const ExerciseList = ({ exercises, setTemplateState, template }: ExerciseListProps) => {
  const router = useRouter();

  const updateTemplate = useTemplateStore(state => state.editTemplate);

  // 點擊下拉, 打開動作的組數設定
  const [openExerciseId, setOpenExerciseId] = useState<string | null>(null);
  const handleToggleExercise = (exerciseId: string) => {
    setOpenExerciseId((prev) => (prev === exerciseId ? null : exerciseId));
  };

  // 左滑後, 點擊刪除
  const handleRemoveExercise = (exerciseId: string) => {
    const updatedExercises = exercises.filter((exercise) => exercise.exerciseId !== exerciseId);

    const updatedTemplate: TemplateType = {
      ...template,
      exercises: updatedExercises,
    };
    // 更新刪除後的儲存
    updateTemplate(template.templateId, updatedTemplate);
    setTemplateState(updatedTemplate);
  };

  // 修改動作組數
  const handleUpdateSets = (exerciseId: string, updatedSets: SetType[]) => {
    const updatedExercises = exercises.map((exercise) =>
      exercise.exerciseId === exerciseId
        ? { ...exercise, sets: updatedSets }
        : exercise
    );

    const updatedTemplate: TemplateType = {
      ...template,
      exercises: updatedExercises,
    };
    // 更新組數設定
    updateTemplate(template.templateId, updatedTemplate);
    setTemplateState(updatedTemplate);
  };


  return (
    <div>
      <div className='flex justify-end items-center gap-3 px-4'>
        <h3 className="font-bold">添加動作</h3>

        <button
          type="button"
          onClick={() => router.push(`/fit/${template.menuId}/${template.templateId}/create-template/exercise-picker`)}
          className='w-10 h-10 flex justify-center items-center duration-300 rounded-full bg-[#66CCFF] hover:brightness-110'
        >
          <div className='w-full h-full rounded-full flex justify-center items-center hover:invert'>
            <CopyPlus className='w-5' />
          </div>
        </button>
      </div>

      <div className='mt-3 px-3 rounded-t-2xl sm:rounded-2xl bg-slate-200'>
        <div className='pt-3'>
          <div className='overflow-y-scroll max-h-[500px] min-h-[500px] rounded-t-2xl'>
            <div className='flex flex-col gap-3 mb-32'>
              {exercises.map((exercise) => (
                <ExerciseListCard
                  key={exercise.exerciseId}
                  exercise={exercise}
                  handleRemoveExercise={handleRemoveExercise}
                  onUpdateSets={handleUpdateSets}
                  isOpen={openExerciseId === exercise.exerciseId}
                  onToggle={() => handleToggleExercise(exercise.exerciseId)}
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
