import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { useWorkoutStore } from "@/lib/store";

import WorkoutList from "./WorkoutList";

import { useSession } from "next-auth/react"
import { upsertWorkoutSession } from "@/actions/user-create";
import { useState } from "react";


type StartWorkoutProps = {
  isEditMode: boolean;
  workoutSession: WorkoutSessionType;
  setCurrentWorkout: React.Dispatch<React.SetStateAction<WorkoutSessionType | null>>;
}

const StartWorkout = ({ workoutSession, isEditMode, setCurrentWorkout }: StartWorkoutProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id
 
  // 本地訓練卡
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
    <div className="sm:pt-10 bg-gray-100">
      <div className="px-4 pt-4">
        <div className='flex w-full justify-between items-center'>
          <h3 className="font-bold text-xl whitespace-nowrap">
            {isEditMode ? "進行的訓練" : "開始訓練"}
          </h3>

          <div>
            <Button
              onClick={handleCompleteWorkout}
              size='sm'
              className='font-bold'
              disabled={isLoading}
            >
              完成
            </Button>
          </div>
        </div>
      </div>

      <WorkoutList
        workoutSession={workoutSession}
        setCurrentWorkout={setCurrentWorkout}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StartWorkout;
