"use client"

import React, { useEffect, useState } from 'react'
import { useTemplateStore } from '@/lib/store';
import StartWorkout from './StartWorkout'

const WorkoutPage = ({ params }: { params: { menuId: string; templateId: string } }) => {
  const { menuId, templateId } = params;

  const [template, setTemplate] = useState<TemplateType>({
    userId: "",
    cardId: "",
    category: "",
    title: "",
    menuId: "",
    exercises: [],
  });

  const templates = useTemplateStore(state => state.templates);
  const useThisTemplate = templates.find(
    template => template.cardId === templateId && template.menuId === menuId
  );

  useEffect(() => {
    if (useThisTemplate) {
      setTemplate(useThisTemplate);
    }
  }, [useThisTemplate]);


  return (
    <div>
      <StartWorkout
        template={template} 
      />
    </div>
  )
}

export default WorkoutPage