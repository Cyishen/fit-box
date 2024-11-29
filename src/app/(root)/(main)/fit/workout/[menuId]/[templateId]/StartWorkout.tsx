import { useRouter } from "next/navigation";

import { useWorkoutStore } from "@/lib/store";

import WorkoutList from "./WorkoutList";

import { useSession } from "next-auth/react"
import { upsertWorkoutSession, upsertWorkoutSummary } from "@/actions/user-create";
import { useState } from "react";
import StaticTitle from "./StaticTitle";

import { useDayCardStore } from "@/lib/day-modal";


type StartWorkoutProps = {
  isEditMode: boolean;
  fetchLoading: boolean;
  workoutSession: WorkoutSessionType;
  setCurrentWorkout: React.Dispatch<React.SetStateAction<WorkoutSessionType | null>>;
}

const StartWorkout = ({ workoutSession, isEditMode, setCurrentWorkout, fetchLoading }: StartWorkoutProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 用戶沒有登入, 使用本地 useWorkoutStore
  const updateWorkoutSession = useWorkoutStore(state => state.editWorkoutSession);
  const updateCurrentSession = (updatedSession: WorkoutSessionType) => {
    updateWorkoutSession(updatedSession.cardSessionId, updatedSession);
  };

  // 用戶登入, 使用本地 dayCard
  const { dayCard, editDayCard } = useDayCardStore();


  const handleCompleteWorkout = async () => {
    setIsLoading(true);

    try {
      const updatedSession = { ...workoutSession };

      if (userId) {
        const currentDayCard = dayCard.find(
          (card) => card.cardSessionId === updatedSession.cardSessionId
        );

        if (currentDayCard && !isEditMode) {
          // 初次建立, 更新 dayCard
          editDayCard(updatedSession.cardSessionId, updatedSession);
          localStorage.removeItem('currentSessionId');
          router.push('/fit');
        } else if (isEditMode) {
          // 編輯時
          editDayCard(updatedSession.cardSessionId, updatedSession);

          // 速度太慢, 改fit頁面背景處理上傳
          // if (updatedSession.id) {
          //   await Promise.all([
          //     upsertWorkoutSession(updatedSession),
          //     upsertWorkoutSummary(updatedSession.id),
          //   ]);
          // } else {
          //   console.warn("Missing ID for session in edit mode");
          // }
        } else {
          // 如果沒有 dayCard，代表點擊的是歷史訓練卡-更新資料庫
          if (workoutSession.id) {
            await Promise.all([
              upsertWorkoutSession(workoutSession),
              upsertWorkoutSummary(workoutSession.id),
            ]);
          } else {
            console.warn("Missing ID for historical session");
          }
        }
      } else {
        // 用戶沒有登入- 更新本地 useWorkoutStore
        updateCurrentSession(updatedSession);
        setCurrentWorkout(updatedSession);
      }
    } catch (error) {
      console.error("Error completing workout", error);
    } finally {
      localStorage.removeItem('currentSessionId');
      router.push('/fit');
    }
  };


  return (
    <div className="sm:pt-10 bg-gray-100 h-screen">
      <StaticTitle
        isEditMode={isEditMode}
        handleCompleteWorkout={handleCompleteWorkout}
        isLoading={isLoading}
      />

      <WorkoutList
        workoutSession={workoutSession}
        setCurrentWorkout={setCurrentWorkout}
        isLoading={isLoading}
        fetchLoading={fetchLoading}
      />
    </div>
  );
};

export default StartWorkout;
