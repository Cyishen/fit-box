"use client"

import React, { useEffect, useState } from 'react'
import { useTemplateStore, useWorkoutStore } from '@/lib/store';
import StartWorkout from '../StartWorkout';

import { useSession } from 'next-auth/react'

const WorkoutEditPage = ({ params }: { params: { menuId: string; templateId: string; sessionId: string } }) => {
  const { menuId, templateId, sessionId } = params;

  const { data: session } = useSession()
  const userId = session?.user?.id

  const [workoutSession, setWorkoutSession] = useState<WorkoutSessionType | null>(null);

  // 本地
  const templates = useTemplateStore(state => state.templates);
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);

  useEffect(() => {
    try {
      if (userId) {
        // 資料庫的數據
      } else {
        if (!templates || templates.length === 0 || !workoutSessions || workoutSessions.length === 0) {
          return;
        }

        const selectedTemplate = templates.find(
          template => template.templateId === templateId && template.menuId === menuId
        );

        const sessionToEdit = workoutSessions.find(session => session.cardSessionId === sessionId);

        if (sessionToEdit) {
          console.log("編輯執行中")
          setWorkoutSession({
            ...sessionToEdit,
            exercises: JSON.parse(JSON.stringify(sessionToEdit.exercises))
          });
        } else if (selectedTemplate) {
          // 預防沒有模板情況下, 一樣可以得到訓練卡
          console.log("找不到訓練卡, 一樣可以得到訓練卡")
          setWorkoutSession({
            cardSessionId: sessionId,
            userId: userId || "Guest",
            menuId: menuId,
            templateId: templateId,
            templateTitle: selectedTemplate.templateTitle,
            date: new Date().toISOString().slice(0, 10),
            exercises: JSON.parse(JSON.stringify(selectedTemplate.exercises))
          });
        }
      }
    } catch (error) {
      console.error("找不到訓練卡", error);
    }

  }, [menuId, sessionId, templateId, templates, userId, workoutSessions]);


  return (
    <div>
      {workoutSession && (
        <StartWorkout
          workoutSession={workoutSession}
          isEditMode={true}
        />
      )}
    </div>
  )
}

export default WorkoutEditPage;
