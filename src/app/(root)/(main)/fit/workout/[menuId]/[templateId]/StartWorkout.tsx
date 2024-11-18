import { useRouter } from "next/navigation";

import { useWorkoutStore } from "@/lib/store";

import WorkoutList from "./WorkoutList";

import { useSession } from "next-auth/react"
import { upsertWorkoutSession } from "@/actions/user-create";
import { useState } from "react";
import StaticTitle from "./StaticTitle";


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
 
  // 本地訓練卡更新
  const updateWorkoutSession = useWorkoutStore(state => state.editWorkoutSession);
  const updateCurrentSession = (updatedSession: WorkoutSessionType) => {
    updateWorkoutSession(updatedSession.cardSessionId, updatedSession);
  };

  const handleCompleteWorkout = async() => {
    setIsLoading(true);

    if(userId){
      // 資料庫
      await upsertWorkoutSession(workoutSession)
    } else {
      // 本地
      const updatedSession = { ...workoutSession };
      updateCurrentSession(updatedSession as WorkoutSessionType);
      setCurrentWorkout(updatedSession)
    }

    localStorage.removeItem('currentSessionId');
    router.push('/fit');
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
