"use client";


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader, ChevronLeft } from 'lucide-react';

import FitSideBar from '@/components/FitSideBar';
import { exerciseWorkouts } from '@/constants/constants';

import { useWorkoutStore } from '@/lib/store';

import { useSession } from 'next-auth/react'
import { getWorkoutSessionByCardId } from '@/actions/user-create';
import { upsertWorkoutSession } from '@/actions/user-create';

import { useDayCardStore } from '@/lib/day-modal';


const ActionPicker = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 用戶沒登入, 本地
  const { workoutSessions, editWorkoutSession } = useWorkoutStore();

  // 初始動作狀態
  const [currentSession, setCurrentSession] = useState<WorkoutSessionType | null>(null);
  // 選中的動作管理
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseType[]>([]);
  // 判斷用戶是點選訓練卡, 還是點選mobile bar路由, 決定是否顯示
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);

  // 用戶登入, dayCard資料
  const { dayCard, editDayCard } = useDayCardStore();

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
    setExistingSessionId(currentSessionId);

    if (!currentSessionId) {
      return;
    }

    const fetchDataExercise = async () => {
      try {
        const workoutCard = await getWorkoutSessionByCardId(currentSessionId)
        const workoutCardExercises = workoutCard?.exercises || [];

        if (workoutCard) {
          setCurrentSession(workoutCard as WorkoutSessionType);
          setSelectedExercises(workoutCardExercises);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (userId) {
      const findCardFromStore = dayCard.find(
        session => session.cardSessionId === currentSessionId
      );
      const findDayCardExercises = findCardFromStore?.exercises || [];

      if (findCardFromStore) {
        setCurrentSession(findCardFromStore);
        setSelectedExercises(findDayCardExercises);
      } else {
        // 沒有dayCard, 代表用戶是點擊歷史訓練卡, 從資料庫加載
        fetchDataExercise()
      }
    } else {
      // 用戶沒有登入
      const findSession = workoutSessions.find(
        session => session.cardSessionId === currentSessionId
      );

      if (findSession) {
        setCurrentSession(findSession);
        setSelectedExercises(findSession?.exercises);
      }
    }
  }, [dayCard, userId, workoutSessions]);

  const handleSaveExercises = async () => {
    setIsLoading(true);

    if (!currentSession) {
      return;
    }

    const menuId = currentSession.menuId;
    const templateId = currentSession.templateId;
    const sessionId = currentSession.cardSessionId;

    const updatedSession = {
      ...currentSession,
      exercises: selectedExercises
    };

    const findCardFromStore = dayCard.find(
      session => session.cardSessionId === sessionId
    );

    if (userId) {
      // 用戶登入, 更新 editDayCard, 頁面才會得到新修改動作
      if (findCardFromStore) {
        editDayCard(sessionId, updatedSession);
      } else {
        // 更新動作到資料庫
        await upsertWorkoutSession(updatedSession);
      }

      router.push(`/fit/workout/${menuId}/${templateId}/${sessionId}`);
    } else {
      // 用戶沒有登入, 更新動作到本地
      if (existingSessionId) {
        editWorkoutSession(existingSessionId, updatedSession);
        router.push(`/fit/workout/${menuId}/${templateId}/${sessionId}`);
      }
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
    <div className='flex pb-10 sm:pt-10 bg-gray-100 sm:bg-white h-screen'>
      <div className='forMobile sm:forWeb'>
        <div className="bg-gray-100 p-4 sm:rounded-2xl">
          {existingSessionId && (
            <div className='flex justify-between'>
              <div
                onClick={() => router.back()}
                className='p-2 rounded-full cursor-pointer bg-white hover:bg-gray-200'
              >
                <ChevronLeft size={16} />
              </div>

              <div className='w-full flex justify-start items-center gap-2 px-5'>
                <p className='bg-black text-white text-sm rounded-sm px-1'>{currentSession?.templateTitle}</p>
                <p className="flex px-1 rounded-full bg-black text-white whitespace-nowrap text-[10px]">
                  {currentSession?.exercises.length} 動作
                </p>
              </div>

              <Button
                size='sm'
                type="button"
                disabled={isLoading}
                className="font-bold"
                onClick={handleSaveExercises}
              >
                {isLoading ? (
                  <div className='flex justify-center items-center gap-1'>
                    <p>儲存</p>
                    <Loader size={10} className="animate-spin" />
                  </div>
                ) : (
                  <div className='flex justify-center items-center gap-1'>
                    <p>選擇</p>
                    <p>{selectedExercises?.length}</p>
                  </div>
                )}
              </Button>
            </div>
          )}

          <div className='flex mt-5 gap-3 mb-20'>
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
                        className={`text-sm mt-2 
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
        </div>
      </div>
    </div>
  )
}

export default ActionPicker