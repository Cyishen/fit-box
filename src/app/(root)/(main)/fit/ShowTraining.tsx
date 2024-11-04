"use client";

import React from 'react'
import { useWorkoutStore } from '@/lib/store';
import ShowTrainingCard from './ShowTrainingCard';


const ShowTraining = () => {
  const { workoutSessions } = useWorkoutStore();

  return (
    <>
      {workoutSessions.map((session: WorkoutSessionType) => (
        <ShowTrainingCard
          key={session.cardSessionId}
          session={session}
        // handleEditWorkout={handleEditWorkout}
        // handleRemoveWorkoutSession={handleRemoveWorkoutSession}
        />
      ))}
    </>
  )
}

export default ShowTraining