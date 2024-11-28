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
console.log(dayCardData)
  const router = useRouter();

  // 卡片狀態管理
  const [workoutCards, setWorkoutCards] = useState<WorkoutSessionType[]>([]);

  // 用戶沒有登入-本地
  const { workoutSessions, removeWorkoutSession } = useWorkoutStore();

  // TODO? 用戶登入, dayCard資料
  const { dayCard, removeDayCard } = useDayCardStore();

  // TODO 第一個useEffect, 把剛剛建立的訓練卡dayCard上傳到資料庫, 用戶不會感受到上傳
  // const isSyncingRef = useRef(false);
  // useEffect(() => {
  //   if (isSyncingRef.current) return;
  //   isSyncingRef.current = true;

  //   const updateToDb = async () => {
  //     try {
  //       if (userId && dayCard && dayCard.length > 0) {

  //         for (const session of dayCard) {
  //           await Promise.all([
  //             upsertWorkoutSession(session),
  //             upsertWorkoutSummary(session.id as string),
  //           ]);
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error syncing DayCard:", error);
  //     } finally {
  //       isSyncingRef.current = false;
  //     }
  //   };
  //   localStorage.removeItem('day-card-storage')
  //   updateToDb();
  // }, [dayCard, userId]);

  // 第二個useEffect, 抓本地的dayCard顯示當天訓練卡
  useEffect(() => {
    try {
      if (userId) {
        // 合併本地 dayCard 與資料庫 dayCardData
        const combinedCards = [
          ...dayCard,
          ...dayCardData.filter(
            (dbCard) => !dayCard.some((localCard) => localCard.cardSessionId === dbCard.cardSessionId)
          ), // 資料庫中不在本地的卡片
        ];

        // const updatedCards = combinedCards.filter(
        //   (card) => dayCardData.some((dbCard) => dbCard.cardSessionId === card.cardSessionId)
        // );

        // console.log('??',updatedCards)

        setWorkoutCards(combinedCards);
      } else {
        // 用戶沒登入-本地找今日的訓練卡
        const today = new Date().toISOString().slice(0, 10);
        const findToday = workoutSessions.filter(session => session.date === today);

        setWorkoutCards(findToday);
      }
    } catch (error) {
      console.error("Can't find card", error);
    }
  }, [dayCard, dayCardData, userId, workoutSessions]);

  // 第三個useEffect, 當dayCard內的訓練卡日期不等於今天日期, 就刪除dayCard
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const storedDate = localStorage.getItem('lastSyncDate');

    if (storedDate !== today) {
      localStorage.removeItem('day-card-storage');
      localStorage.setItem('lastSyncDate', today);
    }
  }, []);


  // 點擊訓練卡到編輯頁面
  const handleEditWorkout = (cardSessionId: string) => {
    if (userId) {
      const findDayCard = dayCard.find(day => day.cardSessionId === cardSessionId);
      const fromDbCard = dayCardData.find(db => db.cardSessionId === cardSessionId);

      if (findDayCard) {
        router.push(`/fit/workout/${findDayCard.menuId}/${findDayCard.templateId}/${cardSessionId}`);
      } else if (fromDbCard) {
        router.push(`/fit/workout/${fromDbCard.menuId}/${fromDbCard.templateId}/${cardSessionId}`);
      }

      localStorage.setItem('currentSessionId', cardSessionId);
    } else {
      // 用戶沒有登入-本地
      const sessionToEdit = workoutSessions.find(session => session.cardSessionId === cardSessionId);

      if (sessionToEdit) {
        router.push(`/fit/workout/${sessionToEdit.menuId}/${sessionToEdit.templateId}/${cardSessionId}`);
      }
      localStorage.setItem('currentSessionId', cardSessionId);
    }
  };

  const handleRemoveWorkoutSession = async (cardSessionId: string) => {
    try {
      if (userId) {
        removeDayCard(cardSessionId);
        await deleteWorkoutSessionByCardId(cardSessionId);
      } else {
        removeWorkoutSession(cardSessionId);
      }
    } catch (error) {
      console.error("Failed to Remove Card", error);
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