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
  const { dayCard, removeDayCard, editDayCard, setAllDayCard } = useDayCardStore();


  // 第一個useEffect, 把剛建立的訓練卡dayCard上傳到資料庫且拿回id給 dayCard(用戶不會感受到上傳)
  const isSyncingRef = useRef(false);
  useEffect(() => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = false;

    const updateToDb = async () => {
      try {
        if (userId && dayCard && dayCard.length > 0) {

          for (const session of dayCard) {
            // 上傳到資料庫，並取得返回的卡片資料（包含 ID）
            const updatedSession = await upsertWorkoutSession(session);

            if (updatedSession?.id && session.id !== updatedSession.id) {
              // 回填 ID 到本地 dayCard
              const updatedLocalCard = {
                ...session,
                id: updatedSession.id,
              };
              editDayCard(session.cardSessionId, updatedLocalCard as WorkoutSessionType);
            }

            await upsertWorkoutSummary(updatedSession.id);
          }
        }
      } catch (error) {
        console.error("Error syncing DayCard:", error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    updateToDb();
  }, [dayCard, userId, editDayCard]);

  // 第二個useEffect, 直接下載當天訓練卡到設備上
  useEffect(() => {
    const fetchCardsAndUpdate = async () => {
      if (userId) {
        try {
          if (dayCardData && dayCardData.length > 0) {
            setAllDayCard(dayCardData);
          } 
        } catch (error) {
          console.error("Error fetching and updating cards:", error);
        }
      }
    };

    fetchCardsAndUpdate();
  }, [dayCardData, userId, setAllDayCard]);

  // 第三個useEffect, dayCard顯示
  useEffect(() => {
    try {
      if (userId) {
        // 1. 因第二個useEffect下載整個dayCard, 能直接顯示dayCard
        if(dayCard && dayCard.length > 0) {
          setWorkoutCards(dayCard);
        } else {
          setWorkoutCards(dayCardData);
        }

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