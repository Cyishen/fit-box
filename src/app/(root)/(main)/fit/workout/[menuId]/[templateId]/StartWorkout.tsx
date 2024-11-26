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

  // 用戶沒有登入-更新本地訓練卡
  const updateWorkoutSession = useWorkoutStore(state => state.editWorkoutSession);
  const updateCurrentSession = (updatedSession: WorkoutSessionType) => {
    updateWorkoutSession(updatedSession.cardSessionId, updatedSession);
  };

  // TODO? 用戶登入, 讀取儲存的 dayCard訓練卡
  const { dayCard, editDayCard } = useDayCardStore();


  const handleCompleteWorkout = async () => {
    setIsLoading(true);

    try {
      if (userId) {
        if (dayCard.length > 0) {
          // TODO? dayCard存在，則更新 dayCard
          const updatedSession = { ...workoutSession };
          editDayCard(updatedSession.cardSessionId, updatedSession);
        } else {
          // 如果沒有 dayCard，則調用 API 更新資料庫
          await Promise.all([
            upsertWorkoutSession(workoutSession),
            upsertWorkoutSummary(workoutSession.id as string),
          ]);
        }
      } else {
        // 用戶沒有登入-則更新本地資料
        const updatedSession = { ...workoutSession };
        updateCurrentSession(updatedSession);
        setCurrentWorkout(updatedSession);
      }
    } catch (error) {
      console.error("Error completing workout", error);
    } finally {
      // 清除 currentSessionId 並跳轉頁面
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
