"use client"

import React, { useEffect, useState } from 'react'
import { useTemplateStore } from '@/lib/store';
import StartWorkout from './StartWorkout'

import { useSession } from 'next-auth/react'

const WorkoutPage = ({ params }: { params: { menuId: string; templateId: string } }) => {
  const { menuId, templateId } = params;

  const { data: session } = useSession()
  const userId = session?.user?.id

  const [workoutSession, setWorkoutSession] = useState<WorkoutSessionType | null>(null);

  // 本地資料
  const templates = useTemplateStore(state => state.templates);
  const selectedTemplate = templates.find(
    template => template.templateId === templateId && template.menuId === menuId
  );

  useEffect(() => {
    try {
      if(userId){
        // 資料庫的數據
      } else {
        if (selectedTemplate) {
          const newWorkoutSession = {
            ...selectedTemplate,
            cardSessionId: Date.now().toString(),
            userId: userId || "Guest",
            isEditMode: false,
            date: new Date().toISOString().slice(0, 10),
          };
          setWorkoutSession(newWorkoutSession as WorkoutSessionType);
        }
      }
    } catch (error) {
      console.log('找不到模板',error)
    }
  }, [selectedTemplate, userId]);


  return (
    <div>
      {workoutSession && (
        <StartWorkout
          workoutSession={workoutSession} 
          isEditMode={false}
        />
      )}
    </div>
  )
}

export default WorkoutPage