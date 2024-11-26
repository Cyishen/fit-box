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

  // 卡片狀態管理
  const [workoutCards, setWorkoutCards] = useState<WorkoutSessionType[]>([]);

  // 用戶沒有登入-本地
  const { workoutSessions, removeWorkoutSession } = useWorkoutStore();

  // TODO? 用戶登入, dayCard資料
  const { dayCard, removeDayCard } = useDayCardStore();

  useEffect(() => {
    if (userId) {
      if (dayCard && dayCard.length > 0) {
        setWorkoutCards(dayCard);
      } else {
        // 沒有dayCard, 搜尋資料庫訓練卡
        setWorkoutCards(dayCardData);
      }
    } else {
      // 用戶沒有登入-本地
      setWorkoutCards(workoutSessions);
    }
  }, [dayCardData, workoutSessions, userId, dayCard]);


  // 點擊訓練卡到編輯頁面
  const handleEditWorkout = (cardSessionId: string) => {
    if (userId) {
      // 資料庫
      if (dayCardData) {
        const sessionCards = dayCardData.find(session => session.cardSessionId === cardSessionId);

        if (sessionCards) {
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
    if (userId) {
      if (dayCard.length > 0) {
        removeDayCard(cardSessionId);
        await deleteWorkoutSessionByCardId(cardSessionId);
      } else {
        // 歷史訓練卡
        await deleteWorkoutSessionByCardId(cardSessionId);
      }
    } else {
      removeWorkoutSession(cardSessionId);
    }
  };

  const showToday = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();

  return (
    <>
      <h1 className='font-bold'>今日訓練 {showToday}</h1>

      {workoutCards.length === 0 ? (
        <p className='text-gray-500 text-sm p-2 border border-dashed rounded-lg '>沒有訓練</p>
      ) : (
        <>
          {workoutCards.map((session) => (
            <ShowTrainingCard
              key={session?.cardSessionId}
              sessionCards={session}
              handleRemoveWorkoutSession={handleRemoveWorkoutSession}
              handleEditWorkout={handleEditWorkout}
            />
          ))}
        </>
      )}

    </>
  )
}

export default ShowDayTraining