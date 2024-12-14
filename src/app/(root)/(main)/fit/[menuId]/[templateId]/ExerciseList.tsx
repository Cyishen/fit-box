import React, { useState } from 'react';
import { useTemplateStore } from '@/lib/store';

import ExerciseListCard from './ExerciseListCard';
import TemplateExerciseButton from './TemplateExerciseButton';

import { useSession } from "next-auth/react"
import { upsertExercise } from '@/actions/user-create';


type ExerciseListProps = {
  template: TemplateType;
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
  isLoading: boolean;
  templateExercise: TemplateExerciseType[];
};

const ExerciseList = ({ template, setTemplateState, isLoading, templateExercise }: ExerciseListProps) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  // 用戶未登入
  const updateTemplate = useTemplateStore(state => state.editTemplate);

  // 修改動作組數
  const handleUpdateSets = async (movementId: string, updatedSets: TemplateSetType[]) => {
    const updatedExercises = templateExercise.map((exercise) =>
      exercise.movementId === movementId
        ? { ...exercise, templateSets: updatedSets }
        : exercise
    );

    const updatedTemplate: TemplateType = {
      ...template,
      templateExercises: updatedExercises,
    };
    if(userId) {
      // 資料庫
      await upsertExercise(updatedExercises, template.id);
      // 更新狀態
      setTemplateState(updatedTemplate);
    } else {
      // 用戶未登入
      updateTemplate(template.id, updatedTemplate);
      // 更新狀態
      setTemplateState(updatedTemplate);
    }
  };


  // 展開點選的動作, 顯示組數列表
  const [openMovementId, setOpenMovementId] = useState<string | null>(null);
  const handleToggleExercise = (movementId: string) => {
    setOpenMovementId((prev) => (prev === movementId ? null : movementId));
  };

  // 左滑後, 點擊刪除
  const handleRemoveExercise = (movementId: string) => {
    const updatedExercises = templateExercise.filter((exercise) => exercise.movementId !== movementId);

    const updatedTemplate: TemplateType = {
      ...template,
      templateExercises: updatedExercises,
    };
    // 用戶未登入
    updateTemplate(template.id ?? '', updatedTemplate);
    // 更新狀態
    setTemplateState(updatedTemplate);
  };


  return (
    <div>
      <div className='flex justify-end items-center gap-3 px-4'>
        <h3 className="font-bold">添加動作</h3>

        {/* BottomSheet 底部向上滑出 */}
        <TemplateExerciseButton
          templateId={template?.id}
          setTemplateState={setTemplateState}
        />
      </div>

      <div className='mt-3 px-3 rounded-t-2xl sm:rounded-2xl bg-slate-200'>
        <div className='pt-3'>
          <div className='overflow-y-scroll max-h-[500px] min-h-[500px] rounded-t-2xl'>
            <div className='flex flex-col gap-3 mb-32'>
              {templateExercise.length > 0 ? (
                <>
                  {templateExercise.map((exercise) => (
                    <ExerciseListCard
                      key={exercise.movementId}
                      exercise={exercise}
                      handleRemoveExercise={handleRemoveExercise}
                      onUpdateSets={handleUpdateSets}
                      isOpen={openMovementId === exercise.movementId}
                      onToggle={() => handleToggleExercise(exercise.movementId)}
                      isLoading={isLoading}
                      templateId={template?.id}
                      setTemplateState={setTemplateState}
                    />
                  ))}
                </>
              ) : (
                <>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;
