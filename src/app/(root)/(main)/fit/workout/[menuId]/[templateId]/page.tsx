"use client"

import React, { useEffect, useMemo, useState } from 'react'

import StartWorkout from './StartWorkout'

import { useSession } from "next-auth/react"
import { getWorkoutSessionByCardId } from '@/actions/user-create';

import { useWorkoutStore } from '@/lib/store';
import { useDayCardStore } from '@/lib/day-modal';
import { useRouter } from 'next/navigation';



const WorkoutPage = ({ }: { params: { menuId: string; templateId: string } }) => {
  const router = useRouter();
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [fetchLoading, setFetchIsLoading] = useState(true);

  // 卡片狀態管理
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSessionType | null>(null);

  // 用戶沒有登入-本地
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);

  // TODO? 用戶登入, 本地找dayCard當天的訓練卡
  const { dayCard, editDayCard } = useDayCardStore();


  const currentSessionId = localStorage.getItem('currentSessionId');
  const findCardFromStore = useMemo(() => {
    return dayCard.find(session => session.cardSessionId === currentSessionId);
  }, [dayCard, currentSessionId]);

  // 第一個useEffect , 把資料庫id 更新給 dayCard
  useEffect(() => {
    if (!currentSessionId) {
      setFetchIsLoading(false);
      return;
    }
  
    const catchDataCardId = async () => {
      try {
        const workoutCard = await getWorkoutSessionByCardId(currentSessionId);
  
        if (findCardFromStore && workoutCard?.id) {
          if (findCardFromStore.id !== workoutCard.id) { 
            const updatedCard = {
              ...findCardFromStore,
              id: workoutCard.id,
            };
            editDayCard(currentSessionId, updatedCard as WorkoutSessionType);
          }
        }
      } catch (error) {
        console.error("Error fetching workout session:", error);
      }
    };
  
    catchDataCardId();
  }, [editDayCard, findCardFromStore, currentSessionId]); 

  // 第二個useEffect, 顯示動作列表
  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentSessionId');

    if (!currentSessionId) {
      setFetchIsLoading(false);
      return;
    }

    const fetchWorkoutFromDatabase = async () => {
      try {
        const workoutCard = await getWorkoutSessionByCardId(currentSessionId);
        if (workoutCard) {
          setCurrentWorkout(workoutCard as WorkoutSessionType);
        }
      } catch (error) {
        console.error("Error fetching workout session:", error);
      } finally {
        setFetchIsLoading(false);
      }
    };

    if (userId) {
      // 用戶登入, 本地找dayCard當天的訓練卡
      const findCardFromStore = dayCard.find(
        session => session.cardSessionId === currentSessionId
      );

      if (findCardFromStore) {
        setCurrentWorkout(findCardFromStore);
        setFetchIsLoading(false);
      } else {
        // 沒有dayCard, 代表用戶是點擊歷史訓練卡, 從資料庫加載
        fetchWorkoutFromDatabase();
      }
    } else {
      // 用戶沒有登入
      const findSession = workoutSessions.find(
        session => session.cardSessionId === currentSessionId
      );

      if (findSession) {
        setCurrentWorkout(findSession);
      }
      setFetchIsLoading(false);
    }
  }, [dayCard, userId, workoutSessions]);


  return (
    <div>
      {currentWorkout || fetchLoading ? (
        <StartWorkout
          isEditMode={false}
          workoutSession={currentWorkout as WorkoutSessionType}
          setCurrentWorkout={setCurrentWorkout}
          fetchLoading={fetchLoading}
        />
      ) : (
        <div className="p-2">
          <p>Oops 訓練卡建立失敗</p>
          <button onClick={() => router.back()}>返回</button>
        </div>
      )}
    </div>
  )
}

export default WorkoutPage