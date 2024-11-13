"use client"

import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react';

import StartWorkout from './StartWorkout'

import { useSession } from "next-auth/react"
import { useWorkoutStore } from '@/lib/store';
import { getWorkoutSessionByCardId } from '@/actions/user-create';



const WorkoutPage = ({ }: { params: { menuId: string; templateId: string } }) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSessionType | null>(null);

  // 本地
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);

  useEffect(() => {
    const currentSessionId = localStorage.getItem('currentSessionId');

    if (!currentSessionId) {
      setIsLoading(false);
      return;
    }

    if (userId) {
      // 資料庫
      const fetchWorkout = async () => {
        try {
          const workoutCard = await getWorkoutSessionByCardId(currentSessionId)
          if (workoutCard) {
            setCurrentWorkout(workoutCard);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchWorkout()
    } else {
      // 本地
      const findSession = workoutSessions.find(
        (session) => session.cardSessionId === currentSessionId
      );
      setCurrentWorkout(findSession as WorkoutSessionType);
      setIsLoading(false);
    }
  }, [userId, workoutSessions]);

  if (isLoading) {
    return <div className='flex h-screen justify-center mt-20'>
      <Loader size={20} className="animate-spin" /> &nbsp; 建立訓練卡...
    </div>
  }

  return (
    <div>
      {currentWorkout && (
        <StartWorkout
          isEditMode={false}
          workoutSession={currentWorkout}
          setCurrentWorkout={setCurrentWorkout}
        />
      )}
    </div>
  )
}

export default WorkoutPage