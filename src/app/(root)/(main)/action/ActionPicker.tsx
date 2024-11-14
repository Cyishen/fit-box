"use client";


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

import FitSideBar from '../fit/[menuId]/[templateId]/create-template/exercise-picker/FitSideBar';
import { exerciseWorkouts } from '@/constants/constants';

import { useWorkoutStore } from '@/lib/store';

import { useSession } from 'next-auth/react'
import { getWorkoutSessionByCardId, upsertWorkoutSession } from '@/actions/user-create';
import { Loader, ChevronLeft} from 'lucide-react';


const ActionPicker = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 本地存儲
  const { workoutSessions, editWorkoutSession } = useWorkoutStore();

  // 初始動作狀態
  const [currentSession, setCurrentSession] = useState<WorkoutSessionType | null>(null);
  // 選中的動作管理
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExerciseType[]>([]);
  // 判斷 action頁面是從訓練卡點選, 還是bar點選
  const [existingSessionId, setExistingSessionId] = useState<string | null>(null);

  // 初始 UI狀態
  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentSessionId');
    setExistingSessionId(currentSessionId);

    if (!currentSessionId) {
      return;
    }

    if (userId) {
      // 資料庫 exercise
      const fetchWorkout = async () => {
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
      fetchWorkout()
    } else {
      // 本地
      const findSession = workoutSessions.find(
        session => session.cardSessionId === currentSessionId
      );

      if (findSession) {
        setCurrentSession(findSession);
        setSelectedExercises(findSession.exercises);
      }
    }
  }, [userId, workoutSessions]);

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

    if (userId) {
      // 更新動作到資料庫
      await upsertWorkoutSession(updatedSession);
      setIsLoading(false);
      router.push(`/fit/workout/${menuId}/${templateId}/${sessionId}`);
    } else {
      // 更新動作到本地
      if (existingSessionId) {
        editWorkoutSession(existingSessionId, updatedSession);
        setIsLoading(false);
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
                <ChevronLeft size={16}/>
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
                    <p>{selectedExercises.length}</p>
                  </div>
                )}
              </Button>
            </div>
          )}

          <div className='flex mt-5 gap-3'>
            <div className='w-32'>
              <h3 className="font-bold">選擇動作</h3>
              <hr className='my-2' />

              <FitSideBar />
            </div>

            <div className='w-full'>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {exerciseWorkouts.map((exercise) => (
                  <div
                    key={exercise.movementId}
                    onClick={() => handleToggleExercise(exercise)}
                    className={`p-2 rounded-md cursor-pointer 
                    ${selectedExercises.some(select => select.movementId === exercise.movementId)
                        ? 'bg-[#66CCFF] ring-1 ring-offset-2 ring-blue-500'
                        : 'bg-white'
                      }`}
                  >
                    <div key={exercise.movementId}>
                      <div className="p-2">
                        <div className="flex flex-col items-center">
                          <Image
                            src='/icons/dumbbell.svg'
                            alt={exercise.name}
                            width={36}
                            height={36}
                          />
                          <p className={`text-sm mt-2 ${selectedExercises.some(select => select.movementId === exercise.movementId) ? 'text-black' : 'text-muted-foreground'}`}>
                            {exercise.name}
                          </p>
                        </div>
                      </div>
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