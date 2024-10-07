"use client"

import { useEffect, useState } from "react";
import ExerciseListCard from '../../../[menuId]/[templateId]/ExerciseListCard';
import { CopyPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

type TemplateProps = {
  template: TemplateType
}

const StartWorkout = ({ template }: TemplateProps) => {

  // 狀態用於保存複製的訓練項目
  const [copiedExercises, setCopiedExercises] = useState<ExerciseType[]>([]);

  useEffect(() => {
    setCopiedExercises(JSON.parse(JSON.stringify(template.exercises)));
  }, [template]);

  const [openExerciseId, setOpenExerciseId] = useState<string | null>(null);

  const handleToggleExercise = (exerciseId: string) => {
    setOpenExerciseId((prev) => (prev === exerciseId ? null : exerciseId));
  };

  const handleRemoveExercise = (exerciseId: string) => {
    setCopiedExercises(prev =>
      prev.filter(exercise => exercise.exerciseId !== exerciseId)
    );
  };

  const handleUpdateSets = (exerciseId: string, updatedSets: SetType[]) => {
    setCopiedExercises(prev =>
      prev.map(exercise => exercise.exerciseId === exerciseId 
        ? { ...exercise, sets: updatedSets } 
        : exercise
      )
    );
  };


  return (
    <div className="sm:py-10">
      <div>
        <div className="p-4">
          <div className='flex justify-between items-center'>
            <h3 className="font-bold">今日訓練紀錄</h3>
            <Button size='sm' className='font-bold'>完成</Button>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className='flex items-center justify-end gap-3'>
            <h3 className="font-bold">計時器</h3>
            <p className="font-bold text-3xl border px-2 py-1 rounded-lg">00:00</p>
          </div>
        </div>

        <div className='flex justify-between items-center px-4'>
          <h3 className="font-bold">添加動作</h3>

          <button
            type="button"
            className='w-10 h-10 flex justify-center items-center duration-300 rounded-full bg-[#66CCFF] hover:brightness-110'
          >
            <div className='w-full h-full rounded-full flex justify-center items-center hover:invert'>
              <CopyPlus className='w-5' />
            </div>
          </button>
        </div>
      </div>

      <div className='mt-3 px-3 rounded-t-2xl sm:rounded-2xl bg-slate-200'>
        <div className='pt-3'>
          <div className='overflow-y-scroll max-h-[500px] min-h-[500px]'>
            <div className='flex flex-col gap-3 pb-20'>
              {copiedExercises.map((exercise) => (
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
  )
}

export default StartWorkout