"use client";


import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import ShowTrainingCard from './ShowTrainingCard';

import { useSession } from "next-auth/react"

import { deleteWorkoutSessionByCardId, upsertWorkoutSession, upsertWorkoutSummary } from '@/actions/user-create';

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
  const { dayCard, removeDayCard, editDayCard } = useDayCardStore();

  // 第一個useEffect, 把剛建立的訓練卡dayCard上傳到資料庫且拿回id給 dayCard(用戶不會感受到上傳)
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!dayCard || dayCard.length === 0 || !userId) return;
    if (isSyncingRef.current) return;

    const debounceTimeout = setTimeout(() => {
      isSyncingRef.current = true;

      const updateToDb = async () => {
        try {
          for (const session of dayCard) {
            const updatedSession = await upsertWorkoutSession(session);
            if (updatedSession?.id && session.id !== updatedSession.id) {
              const updatedLocalCard = {
                ...session,
                id: updatedSession.id
              };
              editDayCard(session.cardSessionId, updatedLocalCard);
            }
            await upsertWorkoutSummary(updatedSession.id);
          }
        } catch (error) {
          console.error("Error syncing DayCard:", error);
        } finally {
          isSyncingRef.current = false;
        }
      };

      updateToDb();
    }, 2000); // 延遲 2 秒同步

    return () => clearTimeout(debounceTimeout);
  }, [dayCard, userId, editDayCard]);

  // 第二個useEffect, 下載當天訓練卡到設備上
  // useEffect(() => {
  //   const fetchCardsAndUpdate = async () => {
  //     if (userId) {
  //       try {
  //         if (dayCardData && dayCardData.length > 0) {
  //           setAllDayCard(dayCardData);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching and updating cards:", error);
  //       }
  //     }

  //   };

  //   fetchCardsAndUpdate();
  // }, [dayCardData, setAllDayCard, userId]);

  // 第三個useEffect, dayCard顯示
  useEffect(() => {
    try {
      if (userId) {
        const userDayCards = dayCard.filter(session => session.userId === userId);

        const mergedCards = [
          ...userDayCards,
          ...dayCardData.filter(card => !userDayCards.some(existingCard => existingCard.cardSessionId === card.cardSessionId)) // 合併不重複的資料庫卡片
        ];
        setWorkoutCards(mergedCards);
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

  // 第四個useEffect, 每天清空dayCard: 當dayCard內的訓練卡日期 !== 今天日期, 就刪除整個 useDayCardStore
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

  const now = new Date();
  const today = new Date().toLocaleDateString();
  const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });

  return (
    <>
      <h1 className='font-bold'>
        今日訓練
        <span className='text-[10px] text-gray-500 pl-2 font-normal'>{today} {weekday}</span>
      </h1>

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