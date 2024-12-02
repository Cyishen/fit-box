"use client"

import React, { useEffect, useState } from 'react'

import StartWorkout from '../StartWorkout';

import { useSession } from 'next-auth/react'
import { getWorkoutSessionByCardId } from '@/actions/user-create';

import { useWorkoutStore } from '@/lib/store';
import { useDayCardStore } from '@/lib/day-modal';



const WorkoutEditPage = ({ params }: { params: { menuId: string; templateId: string; sessionId: string } }) => {
  const { sessionId } = params;
  const [fetchLoading, setFetchIsLoading] = useState(true);

  const { data: session } = useSession()
  const userId = session?.user?.id

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSessionType | null>(null);

  // 用戶沒有登入-本地
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);

  // TODO? 用戶登入, 儲存訓練卡dayCard到本地
  const { dayCard } = useDayCardStore();

  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentSessionId');

    if (!currentSessionId) {
      setFetchIsLoading(false);
      return;
    }

    const fetchWorkoutFromDatabase = async () => {
      try {
        const workoutCard = await getWorkoutSessionByCardId(sessionId);

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
        session => session.cardSessionId === sessionId
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
      const findLocal = workoutSessions.find(
        session => session.cardSessionId === sessionId
      );

      if (findLocal) {
        setCurrentWorkout(findLocal);
        setFetchIsLoading(false);
      }
    }
  }, [dayCard, sessionId, userId, workoutSessions]);

  return (
    <div>
      <StartWorkout
        isEditMode={true}
        workoutSession={currentWorkout as WorkoutSessionType}
        setCurrentWorkout={setCurrentWorkout}
        fetchLoading={fetchLoading}
      />
    </div>
  )
}

export default WorkoutEditPage;
