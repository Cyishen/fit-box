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

  // 本地
  const { workoutSessions, removeWorkoutSession } = useWorkoutStore();

  const [workoutCards, setWorkoutCards] = useState<WorkoutSessionType[]>([]);

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

  // const today = new Date();
  // const todayDate = today.toLocaleDateString();

  // const pastDate = new Date(today);
  // pastDate.setDate(today.getDate() - 7);
  // const lastWeek = pastDate.toLocaleDateString();

  return (
    <>
      <h1 className='font-bold'>
        最近訓練
        {/* <span className='text-[10px] text-gray-500 pl-2 font-normal'>{lastWeek}~{todayDate}</span> */}
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2'>
      {workoutCards.map((session) => (
        <ShowTrainingCard
          key={session?.cardSessionId}
          sessionCards={session}
          handleRemoveWorkoutSession={handleRemoveWorkoutSession}
          handleEditWorkout={handleEditWorkout}
        />
      ))}
      </div>
    </>
  )
}

export default ShowRecentTraining