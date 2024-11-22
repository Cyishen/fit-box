"use client";


import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import ShowTrainingCard from './ShowTrainingCard';

import { useSession } from "next-auth/react"

import { deleteWorkoutSessionByCardId } from '@/actions/user-create';

import { useWorkoutStore } from '@/lib/store';
import { useDayCardStore } from '@/lib/day-modal';



interface Props {
  dayCardData: WorkoutSessionType[];
}

const ShowDayTraining = ({ dayCardData }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const router = useRouter();

  // 無用戶本地
  const { workoutSessions, removeWorkoutSession } = useWorkoutStore();

  // 卡片狀態管理
  const [workoutCards, setWorkoutCards] = useState<WorkoutSessionType[]>([]);

  useEffect(() => {
    if (userId) {
      setWorkoutCards(dayCardData);
    } else {
      // 本地
      setWorkoutCards(workoutSessions);
    }
  }, [dayCardData, workoutSessions, userId]);

  // TODO? dayCard 儲存本地: 把當天訓練卡抓到zustand
  const { setDayCard } = useDayCardStore();
  useEffect(() => {
    if (userId && dayCardData.length > 0) {
      setDayCard(dayCardData)
    } else {
      localStorage.removeItem('day-card-storage')
    }
  }, [dayCardData, setDayCard, userId])

  // 點擊訓練卡到編輯頁面
  const handleEditWorkout = (cardSessionId: string) => {
    if(userId) {
      // 資料庫
      if (dayCardData) {
        const sessionCards = dayCardData.find(session => session.cardSessionId === cardSessionId);

        if(sessionCards) {
          router.push(`/fit/workout/${sessionCards.menuId}/${sessionCards.templateId}/${cardSessionId}`);
        }
      }
      localStorage.setItem('currentSessionId', cardSessionId);
    } else {
      // 無用戶本地
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