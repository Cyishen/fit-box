"use client"

import React, { useEffect, useState } from 'react'
import { useTemplateStore, useUserStore, useWorkoutStore } from '@/lib/store';
import StartWorkout from '../StartWorkout';


const WorkoutEditPage = ({ params }: { params: { menuId: string; templateId: string; sessionId: string } }) => {
  const { menuId, templateId, sessionId } = params;
  const user = useUserStore(state => state.user.userId);

  const [session, setSession] = useState<WorkoutSessionType | null>(null);

  const templates = useTemplateStore(state => state.templates);
  const workoutSessions = useWorkoutStore(state => state.workoutSessions);

  useEffect(() => {
    if (!templates || templates.length === 0 || !workoutSessions || workoutSessions.length === 0) {
      return;
    }
  
    const template = templates.find(
      template => template.templateId === templateId && template.menuId === menuId
    );
    const sessionToEdit = workoutSessions.find(session => session.sessionId === sessionId);

    if (sessionToEdit) {
      setSession(sessionToEdit);
    } else if (template) {
      setSession({
        sessionId: sessionId,
        userId: user,
        menuId: menuId,
        templateId: templateId,
        templateTitle: template.templateTitle,
        date: new Date().toISOString().slice(0, 10),
        exercises: JSON.parse(JSON.stringify(template.exercises))
      });
    }
  }, [menuId, templateId, sessionId, templates, user, workoutSessions]);


  return (
    <div>
      {session && (
        <StartWorkout
          template={session}
          isEditMode={true}
        />
      )}
    </div>
  )
}

export default WorkoutEditPage;
