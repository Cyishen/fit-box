"use client"

import React, { useEffect } from 'react'
import { useTemplateStore, useWorkoutStore } from '@/lib/store';
import StartWorkout from './StartWorkout'

import { useSession } from 'next-auth/react'

const WorkoutPage = ({ params }: { params: { menuId: string; templateId: string } }) => {
  const { menuId, templateId } = params;

  const { data: session } = useSession()
  const userId = session?.user?.id

  // 本地資料
  const templates = useTemplateStore(state => state.templates);
  const selectedTemplate = templates.find(
    template => template.templateId === templateId && template.menuId === menuId
  );

  const workoutSessions = useWorkoutStore(state => state.workoutSessions);
  const addWorkoutSession = useWorkoutStore(state => state.addWorkoutSession);


  useEffect(() => {
    const existingSessionId = localStorage.getItem('currentSessionId');


    try {
      if (userId) {
        // 資料庫的數據
      } else {
        if (selectedTemplate && !existingSessionId) {
          const newWorkoutSession = {
            ...selectedTemplate,
            cardSessionId: Date.now().toString(),
            userId: userId || "Guest",
            date: new Date().toISOString().slice(0, 10),
            exercises: selectedTemplate.exercises.map(exercise => ({
              ...exercise,
              sets: exercise.sets.map(set => ({ ...set }))
            })),
          };
          addWorkoutSession(newWorkoutSession as WorkoutSessionType);

          // currentSessionId給 action頁面取得來添加動作, 判斷修改哪個 workoutSessions訓練卡
          // 預防重複渲染建立
          localStorage.setItem('currentSessionId', newWorkoutSession.cardSessionId);
        }
      }
    } catch (error) {
      console.log('找不到模板', error)
    }
  }, [addWorkoutSession, selectedTemplate, userId]);


  return (
    <div>
      {workoutSessions && (
        <StartWorkout
          workoutSession={workoutSessions[workoutSessions.length - 1]}
          isEditMode={false}
        />
      )}
    </div>
  )
}

export default WorkoutPage