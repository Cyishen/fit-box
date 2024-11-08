import { useState } from "react";
import { useWorkoutStore } from "@/lib/store";

import ExerciseListCard from '../../../[menuId]/[templateId]/ExerciseListCard';
import { useRouter } from "next/navigation";
import { CopyPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";


type StartWorkoutProps = {
  workoutSession: WorkoutSessionType;
  isEditMode: boolean;
}

const StartWorkout = ({ workoutSession, isEditMode }: StartWorkoutProps) => {
  const router = useRouter();

  // 本地訓練卡
  const editWorkoutSession = useWorkoutStore(state => state.editWorkoutSession);

  const updateCurrentSession = (updatedSession: WorkoutSessionType) => {
    editWorkoutSession(updatedSession.cardSessionId, updatedSession);
  };

  // 修改動作組數
  const handleUpdateSets = (movementId: string, updatedSets: SetType[]) => {
    if (workoutSession) {
      const updatedExercises = workoutSession.exercises.map(exercise =>
        exercise.movementId === movementId ? { ...exercise, sets: updatedSets } : exercise
      );

      const updatedSession = { ...workoutSession, exercises: updatedExercises };
      updateCurrentSession(updatedSession);
    }
  };

  // 左滑後, 點擊刪除
  const handleRemoveExercise = (movementId: string) => {
    if (workoutSession) {
      const updatedExercises = workoutSession.exercises.filter(
        exercise => exercise.movementId !== movementId
      );
      const updatedSession = { ...workoutSession, exercises: updatedExercises };
      updateCurrentSession(updatedSession);
    }
  };

  // 動作下拉, 打開動作的組數設定
  const [openMovementId, setOpenMovementId] = useState<string | null>(null);
  const handleToggleExercise = (movementId: string) => {
    setOpenMovementId((prev) => (prev === movementId ? null : movementId));
  };

  const handleCompleteWorkout = () => {
    if (isEditMode) {
      const updatedSession = { ...workoutSession };
      updateCurrentSession(updatedSession as WorkoutSessionType);
    }

    localStorage.removeItem('currentSessionId');

    router.push('/fit');
  };


  return (
    <div className="sm:pt-10 bg-gray-100">
      <div>
        <div className="px-4 pt-4">
          <div className='flex justify-between items-center'>
            <h3 className="font-bold text-xl whitespace-nowrap">
              {isEditMode ? "繼續訓練" : "開始訓練"}
            </h3>

            <div className="flex w-full">
              <div className='w-full flex justify-end items-center px-1'>
                {/* <p className="line-clamp-1 text-gray-400">{template.templateTitle}</p> */}
              </div>

              <Button
                onClick={handleCompleteWorkout}
                size='sm'
                className='font-bold'
              >
                完成
              </Button>
            </div>
          </div>
        </div>

        <div className="px-4 py-3">
          <div className='flex items-center justify-end gap-3'>
            <h3 className="font-bold">計時器</h3>
            <p className="font-bold text-3xl border px-2 py-1 rounded-lg">00:00</p>
          </div>
        </div>

        <div className='flex items-center justify-end gap-3 px-4'>
          <h3 className="font-bold">添加動作</h3>

          <button
            type="button"
            onClick={() => router.push(`/action`)}
            className='w-10 h-10 flex justify-center items-center duration-300 rounded-full bg-[#66CCFF] hover:brightness-110'
          >
            <div className='w-full h-full rounded-full flex justify-center items-center hover:invert'>
              <CopyPlus className='w-5' />
            </div>
          </button>
        </div>
      </div>

      {workoutSession && (
        <div className='mt-3 px-3 rounded-t-2xl sm:rounded-t-2xl bg-slate-200'>
          <div className='pt-3'>
            <div className='overflow-y-scroll h-full min-h-[500px] rounded-t-2xl'>
              <div className='flex flex-col gap-3 mb-32'>
                {workoutSession.exercises.map((exercise) => (
                  <ExerciseListCard
                    key={exercise.movementId}
                    exercise={exercise}
                    handleRemoveExercise={handleRemoveExercise}
                    onUpdateSets={handleUpdateSets}
                    isOpen={openMovementId === exercise.movementId}
                    onToggle={() => handleToggleExercise(exercise.movementId)}
                    isLoading={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartWorkout;
