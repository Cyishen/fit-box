"use client"

import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react';

import { useWorkoutStore } from '@/lib/store';
import StartWorkout from '../StartWorkout';

import { useSession } from 'next-auth/react'
import { getWorkoutSessionByCardId } from '@/actions/user-create';


const WorkoutEditPage = ({ params }: { params: { menuId: string; templateId: string; sessionId: string } }) => {
  const { menuId, templateId, sessionId } = params;

  const { data: session } = useSession()
  const userId = session?.user?.id

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutSessionType | null>(null);

  // 本地
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      return;
    }

    if (userId) {
      // 資料庫數據
      const fetchWorkout = async () => {
        try {
          const workoutCard = await getWorkoutSessionByCardId(sessionId)

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
        session => session.cardSessionId === sessionId
      );

      if (findSession) {
        setCurrentWorkout(findSession);
        setIsLoading(false);
      }
    }
  }, [menuId, sessionId, templateId, userId, workoutSessions]);


  if (isLoading) {
    return <div className='flex h-screen justify-center mt-20'>
      <Loader size={20} className="animate-spin" /> &nbsp; 加載中...
    </div>
  }

  return (
    <div>
      {currentWorkout && (
        <StartWorkout
          isEditMode={true}
          workoutSession={currentWorkout}
          setCurrentWorkout={setCurrentWorkout}
        />
      )}
    </div>
  )
}

export default WorkoutEditPage;
