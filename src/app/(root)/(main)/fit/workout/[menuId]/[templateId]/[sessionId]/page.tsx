"use client"

import React, { useEffect, useState } from 'react'

import { useWorkoutStore } from '@/lib/store';
import StartWorkout from '../StartWorkout';

import { useSession } from 'next-auth/react'
import { getWorkoutSessionByCardId } from '@/actions/user-create';



const WorkoutEditPage = ({ params }: { params: { menuId: string; templateId: string; sessionId: string } }) => {
  const { menuId, templateId, sessionId } = params;
  const [fetchLoading, setFetchIsLoading] = useState(true);

  const { data: session } = useSession()
  const userId = session?.user?.id

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSessionType | null>(null);

  // 本地
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);

  useEffect(() => {
    if (userId) {
      // 資料庫數據
      const fetchWorkout = async () => {
        try {
          const workoutCard = await getWorkoutSessionByCardId(sessionId)

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
        session => session.cardSessionId === sessionId
      );

      if (findSession) {
        setCurrentWorkout(findSession);
      }
    }
  }, [menuId, sessionId, templateId, userId, workoutSessions]);


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
