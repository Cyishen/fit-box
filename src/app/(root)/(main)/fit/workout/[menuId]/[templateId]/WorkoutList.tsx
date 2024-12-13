import { useState } from "react";
import { useRouter } from "next/navigation";
import { CopyPlus } from 'lucide-react';
import { SkeletonCard } from "../../../[menuId]/[templateId]/SkeletonCard";

import WorkoutListCard from "./WorkoutListCard";

import { useSession } from "next-auth/react"

import { useWorkoutStore } from "@/lib/store";
import { useDayCardStore } from "@/lib/day-modal";
import { upsertWorkoutSession, upsertWorkoutSummary } from "@/actions/user-create";
import { Button } from "@/components/ui/button";



type StartWorkoutProps = {
  workoutSession: WorkoutSessionType;
  setCurrentWorkoutCardState: React.Dispatch<React.SetStateAction<WorkoutSessionType | null>>;
  isLoading: boolean
  fetchLoading: boolean
}

const WorkoutList = ({ workoutSession, setCurrentWorkoutCardState, isLoading, fetchLoading }: StartWorkoutProps) => {
  const router = useRouter();

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 用戶沒有登入-更新本地訓練卡
  const editWorkoutSession = useWorkoutStore(state => state.editWorkoutSession);
  const updateLocalCard = (updatedSession: WorkoutSessionType) => {
    editWorkoutSession(updatedSession.cardSessionId, updatedSession);
  };

  // dayCard 讀取儲存的訓練卡
  const { dayCard, editDayCard } = useDayCardStore();
  const findCardFromLocalDb = dayCard.find(
    session => session.cardSessionId === workoutSession?.cardSessionId
  );


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

    if (userId) {
      // 用戶登入(workoutSession有來自本地或資料庫)
      if (findCardFromLocalDb) {
        editDayCard(updatedSession.cardSessionId, updatedSession)
        setCurrentWorkoutCardState(updatedSession);
      } else {
        // 資料庫更新
        await Promise.all([
          upsertWorkoutSession(updatedSession),
          upsertWorkoutSummary(updatedSession.id as string),
        ]);
      }
    } else {
      // 無用戶登入, 本地更新
      updateLocalCard(updatedSession);
    }
  };

  // 展開點選的動作, 顯示組數列表
  const [openMovementId, setOpenMovementId] = useState<string | null>(null);
  const handleToggleExercise = (movementId: string) => {
    setOpenMovementId((prev) => (prev === movementId ? null : movementId));
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

      if (userId) {
        // 用戶登入
        if (findCardFromLocalDb) {
          editDayCard(updatedSession.cardSessionId, updatedSession)
          setCurrentWorkoutCardState(updatedSession);
        } else {
          // 資料庫更新
          await Promise.all([
            upsertWorkoutSession(updatedSession),
            upsertWorkoutSummary(updatedSession.id as string),
          ]);
          setCurrentWorkoutCardState(updatedSession);
        }
      } else {
        // 用戶沒登入
        updateLocalCard(updatedSession);
        setCurrentWorkoutCardState(updatedSession);
      }
    }
  };

  return (
    <div>
      <div className='flex items-center justify-end gap-3 px-4'>
        <h3 className="font-bold">添加動作</h3>
        <Button
          type="button"
          className='w-8 h-8 flex justify-center items-center duration-300 rounded-full'
          onClick={() => router.push(`/action`)}
        >
          <div className='min-w-8 min-h-8 rounded-full flex justify-center items-center'>
            <CopyPlus size={14} />
          </div>
        </Button>
      </div>

      <div className='mt-3 px-3 rounded-t-2xl sm:rounded-t-2xl bg-slate-200'>
        <div className='pt-3'>
          <div className='overflow-y-scroll h-full min-h-[500px] rounded-t-2xl'>
            <div className='flex flex-col gap-3 mb-32'>
              {workoutSession?.exercises?.length > 0 ? (
                <>
                  {fetchLoading
                    ? Array(3)
                      .fill(null)
                      .map((_, index) => <SkeletonCard key={index} />)
                    : (
                      workoutSession?.exercises.map((exercise) => (
                        <WorkoutListCard
                          key={exercise.movementId}
                          exercise={exercise}

                          handleRemoveExercise={handleRemoveExercise}
                          onUpdateSets={handleUpdateSets}
                          isOpen={openMovementId === exercise.movementId}
                          onToggle={() => handleToggleExercise(exercise.movementId)}
                          isLoading={isLoading}
                          setCurrentWorkoutCardState={setCurrentWorkoutCardState}
                        />
                      ))
                    )}
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
  )
}

export default WorkoutList
