"use client"

import React, { useEffect, useState } from 'react'

import StartWorkout from '../StartWorkout';

import { useSession } from 'next-auth/react'
// import { getWorkoutSessionByCardId } from '@/actions/user-create';

import { useWorkoutStore } from '@/lib/store';
import { useDayCardStore } from '@/lib/day-modal';



const WorkoutEditPage = ({ params }: { params: { menuId: string; templateId: string; sessionId: string } }) => {
  const { menuId, templateId, sessionId } = params;
  const [fetchLoading, setFetchIsLoading] = useState(true);

  const { data: session } = useSession()
  const userId = session?.user?.id

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSessionType | null>(null);

  // 無用戶本地
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);

  // TODO? dayCard 儲存本地, 讀取儲存的訓練卡
  const { dayCard } = useDayCardStore();

  useEffect(() => {
    if (userId) {
      // todo? dayCard 儲存本地, 找到符合cardSessionId的卡片
      const findCardFromStore = dayCard.find(
        session => session.cardSessionId === sessionId
      )
      if(findCardFromStore) {
        setCurrentWorkout(findCardFromStore);
      }
      setFetchIsLoading(false);

      // 資料庫讀取, 速度比較慢
      // const fetchWorkout = async () => {
      //   try {
      //     const workoutCard = await getWorkoutSessionByCardId(sessionId)

      //     if (workoutCard) {
      //       setCurrentWorkout(workoutCard as WorkoutSessionType);
      //     }
      //   } catch (error) {
      //     console.log(error);
      //   } finally {
      //     setFetchIsLoading(false);
      //   }
      // }
      // fetchWorkout()
    } else {
      // 本地
      const findSession = workoutSessions.find(
        session => session.cardSessionId === sessionId
      );
      if (findSession) {
        setCurrentWorkout(findSession);
      }
      setFetchIsLoading(false);
    }
  }, [dayCard, menuId, sessionId, templateId, userId, workoutSessions]);


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
