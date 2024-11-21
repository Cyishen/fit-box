"use client"

import React, { useEffect, useState } from 'react'

import StartWorkout from './StartWorkout'

import { useSession } from "next-auth/react"
import { getWorkoutSessionByCardId } from '@/actions/user-create';

import { useWorkoutStore } from '@/lib/store';
import { useDayCardStore } from '@/lib/day-modal';


const WorkoutPage = ({ }: { params: { menuId: string; templateId: string } }) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [fetchLoading, setFetchIsLoading] = useState(true);

  // 無用戶本地
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);
  // 卡片狀態管理
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSessionType | null>(null);

  // TODO? dayCard 儲存本地, 讀取儲存的訓練卡
  const { dayCard } = useDayCardStore();

  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentSessionId');

    if (!currentSessionId) {
      setFetchIsLoading(false);
      return;
    }

    if (userId) {
      // todo? dayCard 儲存本地, 找到符合cardSessionId的卡片
      const findCardFromStore = dayCard.find(
        session => session.cardSessionId === currentSessionId
      )
      if (findCardFromStore) {
        setCurrentWorkout(findCardFromStore);
      }
      setFetchIsLoading(false);

      // 資料庫
      const fetchWorkout = async () => {
        try {
          const workoutCard = await getWorkoutSessionByCardId(currentSessionId)
          if (workoutCard) {
            setCurrentWorkout(workoutCard as WorkoutSessionType);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setFetchIsLoading(false);
        }
      }
      fetchWorkout()
    } else {
      // 無用戶本地
      const findSession = workoutSessions.find(
        (session) => session.cardSessionId === currentSessionId
      );
      setCurrentWorkout(findSession as WorkoutSessionType);
      setFetchIsLoading(false);
    }

  }, [dayCard, userId, workoutSessions]);

  return (
    <div>
      <StartWorkout
        isEditMode={false}
        workoutSession={currentWorkout as WorkoutSessionType}
        setCurrentWorkout={setCurrentWorkout}
        fetchLoading={fetchLoading}
      />
    </div>
  )
}

export default WorkoutPage