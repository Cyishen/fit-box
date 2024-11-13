import { useState } from "react";
import { useRouter } from "next/navigation";
import { CopyPlus } from 'lucide-react';

import WorkoutListCard from "./WorkoutListCard";
import { useWorkoutStore } from "@/lib/store";

import { useSession } from "next-auth/react"
import { upsertWorkoutSession } from "@/actions/user-create";


type StartWorkoutProps = {
  workoutSession: WorkoutSessionType;
  setCurrentWorkout: React.Dispatch<React.SetStateAction<WorkoutSessionType | null>>;
}

const WorkoutList = ({ workoutSession, setCurrentWorkout }: StartWorkoutProps) => {
  const router = useRouter();

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 本地訓練卡
  const updateWorkoutSession = useWorkoutStore(state => state.editWorkoutSession);
  const updateCurrentSession = (updatedSession: WorkoutSessionType) => {
    updateWorkoutSession(updatedSession.cardSessionId, updatedSession);
  };

  // 打開動作的組數設定
  const [openMovementId, setOpenMovementId] = useState<string | null>(null);
  const handleToggleExercise = (movementId: string) => {
    setOpenMovementId((prev) => (prev === movementId ? null : movementId));
  };

  // 修改動作組數
  const handleUpdateSets = async (movementId: string, updatedSets: WorkoutSetType[]) => {
    const updatedExercises = workoutSession.exercises.map(exercise =>
      exercise.movementId === movementId
        ? { ...exercise, sets: updatedSets }
        : exercise
    );

    const updatedSession = {
      ...workoutSession,
      exercises: updatedExercises
    }

    if(userId) {
      // 資料庫更新
      await upsertWorkoutSession(updatedSession)
      setCurrentWorkout(updatedSession);
    } else{
      // 本地更新
      updateCurrentSession(updatedSession);
    }
  };

  // 左滑後, 點擊刪除
  const handleRemoveExercise = async (movementId: string) => {
    if (workoutSession) {
      const updatedExercises = workoutSession.exercises.filter(
        exercise => exercise.movementId !== movementId
      );
      const updatedSession = {
        ...workoutSession,
        exercises: updatedExercises
      };

      if(userId) {
        // 資料庫更新
        await upsertWorkoutSession(updatedSession)
        setCurrentWorkout(updatedSession);
      } else{
        // 本地更新
        updateCurrentSession(updatedSession);
      }
    }
  };

  return (
    <div>
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

      {workoutSession && (
        <div className='mt-3 px-3 rounded-t-2xl sm:rounded-t-2xl bg-slate-200'>
          <div className='pt-3'>
            <div className='overflow-y-scroll h-full min-h-[500px] rounded-t-2xl'>
              <div className='flex flex-col gap-3 mb-32'>
                {workoutSession.exercises.map((exercise) => (
                  <WorkoutListCard
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
  )
}

export default WorkoutList
