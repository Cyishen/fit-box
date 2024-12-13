import { useRouter } from "next/navigation";
import { useState } from "react";

import WorkoutList from "./WorkoutList";

import { useSession } from "next-auth/react"

import StaticTitle from "./StaticTitle";

import { useWorkoutStore } from "@/lib/store";
import { useDayCardStore } from "@/lib/day-modal";


type StartWorkoutProps = {
  isEditMode: boolean;
  workoutSession: WorkoutSessionType;
  setCurrentWorkoutCardState: React.Dispatch<React.SetStateAction<WorkoutSessionType | null>>;
  fetchLoading: boolean;
}

const StartWorkout = ({ isEditMode, workoutSession, setCurrentWorkoutCardState, fetchLoading }: StartWorkoutProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 用戶沒有登入, 使用本地 useWorkoutStore
  const editWorkoutSession = useWorkoutStore(state => state.editWorkoutSession);
  const updateLocalCard = (updated: WorkoutSessionType) => {
    editWorkoutSession(updated.cardSessionId, updated);
  };

  // 用戶登入, 使用本地 dayCard
  const { dayCard, editDayCard } = useDayCardStore();

  const handleCompleteWorkout = async () => {
    setIsLoading(true);

    try {
      const updatedSession = { ...workoutSession };

      if (userId) {
        // 用戶登入(區分點擊的是本地dayCard或資料庫)
        const currentDayCard = dayCard.find(
          (card) => card.cardSessionId === updatedSession.cardSessionId
        );

        if (currentDayCard) {
          // 更新 dayCard
          editDayCard(updatedSession.cardSessionId, updatedSession);
          setCurrentWorkoutCardState(updatedSession)
        }
      } else {
        // 用戶沒有登入- 更新本地 useWorkoutStore
        updateLocalCard(updatedSession);
        setCurrentWorkoutCardState(updatedSession);
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
        setCurrentWorkoutCardState={setCurrentWorkoutCardState}
        isLoading={isLoading}
        fetchLoading={fetchLoading}
      />
    </div>
  );
};

export default StartWorkout;
