"use client"


import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

import BottomSheet from '@/components/BottomSheet'
import FitSideBar from '@/components/FitSideBar';

import { useSession } from 'next-auth/react'

import { useWorkoutStore } from '@/lib/store';
import { useDayCardStore } from '@/lib/day-modal';

import { exerciseWorkouts } from '@/constants/constants';
import { upsertWorkoutSession } from '@/actions/user-create';



type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  workoutSession: WorkoutSessionType;
  setCurrentWorkoutCardState: React.Dispatch<React.SetStateAction<WorkoutSessionType | null>>;
}
const WorkoutPickerSheet = ({
  isOpen,
  setIsOpen,
  workoutSession,
  setCurrentWorkoutCardState
}: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const currentSessionId = localStorage.getItem('currentSessionId');
  const [isLoading, setIsLoading] = useState(false);

  // 用戶沒登入, 本地
  const { workoutSessions, editWorkoutSession } = useWorkoutStore();
  const findLocal = workoutSessions?.find(session => session.cardSessionId === currentSessionId);

  // 用戶登入, dayCard資料
  const { dayCard, editDayCard } = useDayCardStore();
  const findDayCard = dayCard?.find(session => session.cardSessionId === currentSessionId);

  // 選中的動作管理
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseType[]>([]);

  // 比對傳遞的動作與新修改選項的變化
  const [initialMovementIds, setInitialMovementIds] = useState<string[]>([]);

  const selectedMovementIds = selectedExercises.map(ex => ex.movementId);

  const newChanges = initialMovementIds.length === 0
    ? selectedExercises.length > 0
    : initialMovementIds.some(id => !selectedMovementIds.includes(id)) ||
    selectedMovementIds.some(id => !initialMovementIds.includes(id));


  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentSessionId');

    if (!currentSessionId) return

    if (userId) {
      // 用戶登入
      const findWorkoutExercises = workoutSession?.exercises || [];
      if (workoutSession) {
        setSelectedExercises(findWorkoutExercises)
        setInitialMovementIds(findWorkoutExercises.map(ex => ex.movementId))
      }

    } else if (findLocal) {
      // 用戶沒登入
      setSelectedExercises(findLocal.exercises);
      setInitialMovementIds(findLocal.exercises.map(ex => ex.movementId));
    }
  }, [findLocal, userId, workoutSession]);


  // 左邊選單分類
  const [category, setCategory] = useState<string>('胸');
  const filteredWorkouts = exerciseWorkouts.filter(
    (exercise) => exercise.exerciseCategory === category
  );
  // 動作分類
  const categoryCounts = selectedExercises.reduce((acc, exercise) => {
    const category = exercise.exerciseCategory;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  const handleSaveExercises = async () => {
    setIsLoading(true);

    const currentSessionId = localStorage.getItem('currentSessionId');

    const updatedSession = {
      ...workoutSession,
      exercises: selectedExercises
    };

    try {
      if (userId) {
        if (findDayCard) {
          editDayCard(currentSessionId as string, updatedSession);
        } else {
          // 歷史訓練卡, 更新動作到資料庫
          await upsertWorkoutSession(updatedSession);
          // 更新列表狀態
          setCurrentWorkoutCardState(updatedSession);
        }
      } else {
        // 用戶沒登入
        if (findLocal) {
          const updatedWorkoutExercise: WorkoutSessionType = {
            ...findLocal,
            exercises: selectedExercises,
          };

          editWorkoutSession(updatedWorkoutExercise.cardSessionId, updatedWorkoutExercise);
        }
      }

      setIsOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error saving exercises:", error);
      setIsLoading(false);
      alert("儲存失敗，請稍後再試！");
    }
  };

  const handleToggleExercise = (exercise: WorkoutExerciseType) => {
    const isSelected = selectedExercises.some(ex => ex.movementId === exercise.movementId);

    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(ex => ex.movementId !== exercise.movementId));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className='flex justify-end px-4 bg-gray-100 sticky top-10 pb-2'>
        {newChanges ? (
          <Button
            size='sm'
            type="button"
            disabled={isLoading}
            className="font-bold"
            onClick={handleSaveExercises}
          >
            {isLoading ? (
              <>
                <Loader size={14} className="animate-spin" />
              </>
            ) : (
              <>變更 {selectedExercises.length}</>
            )}
          </Button>
        ) : (
          <Button
            size='sm'
            type='button'
            disabled
            variant='outline'
            className='flex items-center'
          >
            已選 {selectedExercises.length}
          </Button>
        )}
      </div>

      <div className='flex mt-1 gap-3 mb-20 px-4'>
        <div className='w-28'>
          <h3 className="font-bold">選擇動作</h3>
          <hr className='my-2' />

          <FitSideBar
            category={category}
            setCategoryState={setCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        <div className='w-full no-select'>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredWorkouts.map((exercise) => (
              <div
                key={exercise.movementId}
                onClick={() => handleToggleExercise(exercise)}
                className={`p-2 rounded-md cursor-pointer
                    ${selectedExercises.some(select => select.movementId === exercise.movementId)
                    ? 'bg-white ring-1 ring-offset-2 ring-blue-500'
                    : 'bg-white'
                  }`}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={exercise.iconSrc as string}
                    alt={exercise.name}
                    width={36}
                    height={36}
                    className='object-contain w-16'
                  />
                  <p
                    className={`text-sm mt-2 line-clamp-1 
                      ${selectedExercises.some(select => select.movementId === exercise.movementId)
                        ? 'text-black'
                        : 'text-muted-foreground'
                      }`}
                  >
                    {exercise.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  )
}

export default WorkoutPickerSheet