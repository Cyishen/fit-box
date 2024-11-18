"use client"

import React, { useEffect, useState } from 'react'

import StartWorkout from './StartWorkout'

import { useSession } from "next-auth/react"
import { useWorkoutStore } from '@/lib/store';
import { getWorkoutSessionByCardId } from '@/actions/user-create';



const WorkoutPage = ({ }: { params: { menuId: string; templateId: string } }) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [fetchLoading, setFetchIsLoading] = useState(true);

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSessionType | null>(null);

  // 本地
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);

  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentSessionId');

    if (!currentSessionId) {
      setFetchIsLoading(false);
      return;
    }

    if (userId) {
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
      // 本地
      const findSession = workoutSessions.find(
        (session) => session.cardSessionId === currentSessionId
      );
      setCurrentWorkout(findSession as WorkoutSessionType);
      setFetchIsLoading(false);
    }

  }, [userId, workoutSessions]);

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