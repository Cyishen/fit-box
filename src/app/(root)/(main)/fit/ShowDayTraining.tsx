"use client";


import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import ShowTrainingCard from './ShowTrainingCard';

import { useSession } from "next-auth/react"

import { deleteWorkoutSessionByCardId } from '@/actions/user-create';
import { useWorkoutStore } from '@/lib/store';



interface Props {
  sessionData: WorkoutSessionType[];
}

const ShowDayTraining = ({ sessionData }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const router = useRouter();

  const { workoutSessions, removeWorkoutSession } = useWorkoutStore();

  const [workoutCards, setWorkoutCards] = useState<WorkoutSessionType[]>([]);

  useEffect(() => {
    if (userId) {
      setWorkoutCards(sessionData);
    } else {
      // 本地
      setWorkoutCards(workoutSessions);
    }
  }, [sessionData, workoutSessions, userId]);


  const handleEditWorkout = (cardSessionId: string) => {
    if(userId) {
      // 資料庫
      if (sessionData) {
        const sessionCards = sessionData.find(session => session.cardSessionId === cardSessionId);

        if(sessionCards) {
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
    if(userId) {
      await deleteWorkoutSessionByCardId(cardSessionId);
    } else {
      removeWorkoutSession(cardSessionId);
    }
  };

  const showToday = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();

  return (
    <>
      <h1 className='font-bold'>今日訓練 {showToday}</h1>

      {workoutCards.map((session) => (
        <ShowTrainingCard
          key={session?.cardSessionId}
          sessionCards={session}
          handleRemoveWorkoutSession={handleRemoveWorkoutSession}
          handleEditWorkout={handleEditWorkout}
        />
      ))}
    </>
  )
}

export default ShowDayTraining