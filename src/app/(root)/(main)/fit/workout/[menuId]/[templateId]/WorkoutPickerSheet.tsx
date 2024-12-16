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
import { getWorkoutSessionByCardId, upsertWorkoutSession } from '@/actions/user-create';



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

  // 新方式
  const [initialMovementIds, setInitialMovementIds] = useState<string[]>([]);

  const currentMovementIds = selectedExercises.map(ex => ex.movementId);
  const newChanges =
    initialMovementIds.length === 0
      ? selectedExercises.length > 0
      : initialMovementIds.some(id => !currentMovementIds.includes(id)) ||
      currentMovementIds.some(id => !initialMovementIds.includes(id));

  // 原本方式, 判斷動作選項的改變
  // const localMovement = findLocal?.exercises.map(ex => ex.movementId) || [];
  // const dayCardMovement = findDayCard?.exercises.map(ex => ex.movementId) || [];
  // const choseFolder = userId
  //   ? dayCardMovement
  //   : localMovement;
  // const showSelectedMovementId = selectedExercises.map(ex => ex.movementId);
  // // 找出新增的動作, 不存在於原始資料
  // const addedMovementIds = showSelectedMovementId.filter(id => !choseFolder.includes(id));
  // // 找出刪除的動作, 不存在於新選項
  // const removedMovementIds = choseFolder.filter(id => !showSelectedMovementId.includes(id));
  // // 判斷是否有變化
  // const hasChanges = addedMovementIds?.length > 0 || removedMovementIds?.length > 0;


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


  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentSessionId');

    if (!currentSessionId) return

    const fetchDataExercise = async () => {
      try {
        const workoutCard = await getWorkoutSessionByCardId(currentSessionId)
        const workoutCardExercises = workoutCard?.exercises || [];

        if (workoutCard) {
          setSelectedExercises(workoutCardExercises);
          setInitialMovementIds(workoutCardExercises.map(ex => ex.movementId));
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (userId) {
      const findDayCardExercises = findDayCard?.exercises || [];

      if (findDayCard) {
        setSelectedExercises(findDayCardExercises);
        setInitialMovementIds(findDayCardExercises.map(ex => ex.movementId));
      } else {
        // findDayCard沒找到, 代表用戶是點擊歷史訓練卡, 從資料庫加載
        fetchDataExercise()
      }
    } else if (findLocal) {
      // 用戶沒登入
      setSelectedExercises(findLocal.exercises);
    }
  }, [findDayCard, findLocal, setCurrentWorkoutCardState, userId]);


  const handleSaveExercises = async () => {
    setIsLoading(true);

    const currentSessionId = localStorage.getItem('currentSessionId');

    const updatedSession = {
      ...workoutSession,
      exercises: selectedExercises
    };

    const findDayCard = dayCard.find(
      session => session.cardSessionId === currentSessionId
    );
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