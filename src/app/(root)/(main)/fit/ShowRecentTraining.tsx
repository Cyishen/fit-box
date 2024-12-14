"use client";


import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import ShowTrainingCard from './ShowTrainingCard';

import { useSession } from "next-auth/react"

import { deleteWorkoutSessionByCardId } from '@/actions/user-create';
import { useWorkoutStore } from '@/lib/store';


interface Props {
  weekData: WorkoutSessionType[];
}

const ShowRecentTraining = ({ weekData }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const router = useRouter();

  // 用戶未登入
  const { workoutSessions, removeWorkoutSession } = useWorkoutStore();

  const [workoutCards, setWorkoutCards] = useState<WorkoutSessionType[]>([]);

  const [showAll, setShowAll] = useState(false);
  const visibleCards = showAll ? workoutCards : workoutCards.slice(0, 0);

  useEffect(() => {
    if (userId) {
      setWorkoutCards(weekData);
    } else {
      // 用戶未登入
      setWorkoutCards(workoutSessions);
    }
  }, [weekData, workoutSessions, userId]);


  const handleEditWorkout = (cardSessionId: string) => {
    if (userId) {
      // 資料庫
      if (weekData) {
        const sessionCards = weekData.find(session => session.cardSessionId === cardSessionId);

        if (sessionCards) {
          router.push(`/fit/workout/${sessionCards.menuId}/${sessionCards.templateId}/${cardSessionId}`);
        }
      }
      localStorage.setItem('currentSessionId', cardSessionId);
    } else {
      // 本地
      const sessionToEdit = workoutSessions.find(session => session.cardSessionId === cardSessionId);

      if (sessionToEdit) {
        router.push(`/fit/workout/${sessionToEdit.menuId}/${sessionToEdit.templateId}/${cardSessionId}`);
      }
      localStorage.setItem('currentSessionId', cardSessionId);
    }
  };

  const handleRemoveWorkoutSession = async (cardSessionId: string) => {
    if (userId) {
      await deleteWorkoutSessionByCardId(cardSessionId);
    } else {
      removeWorkoutSession(cardSessionId);
    }
  };


  return (
    <>
      <h1 className='font-bold'>
        最近訓練
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2'>
      {visibleCards.map((session) => (
        <ShowTrainingCard
          key={session?.cardSessionId}
          sessionCards={session}
          handleRemoveWorkoutSession={handleRemoveWorkoutSession}
          handleEditWorkout={handleEditWorkout}
        />
      ))}
      </div>

      {workoutCards.length > 0 && !showAll && (
        <div className="my-4 text-center text-sm">
          <button
            onClick={() => setShowAll(true)}
            className='hover:bg-slate-100 px-2 py-1 rounded-sm'
          >
            顯示更多
          </button>
        </div>
      )}
    </>
  )
}

export default ShowRecentTraining