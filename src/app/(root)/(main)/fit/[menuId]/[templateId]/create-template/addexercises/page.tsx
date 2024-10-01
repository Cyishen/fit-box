"use client";

import Wrapper from '@/components/Wrapper';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Exercise } from '../WeightTraining';
import { useTemplateStore } from '@/lib/store';
import { TemplateType } from '../Form';

const exerciseTemplates: Exercise[] = [
  { ExerciseId: '1', name: '啞鈴胸推', sets: [] },
  { ExerciseId: '2', name: '深蹲', sets: [] },
  { ExerciseId: '3', name: '肩推', sets: [] },
];

const AddExercisesPage = ({ params }: { params: { templateId: string } }) => {
  const router = useRouter();
  const { templateId } = params;

  const templates = useTemplateStore(state => state.templates);
  const currentTemplate = templates.find(template => template.cardId === templateId);

  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (currentTemplate) {
      setSelectedExercises(currentTemplate.exercises);
    }
  }, [currentTemplate]);

  const handleToggleExercise = (exercise: Exercise) => {
    const isSelected = selectedExercises.some(ex => ex.ExerciseId === exercise.ExerciseId);

    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(ex => ex.ExerciseId !== exercise.ExerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const handleSaveExercises = () => {
    if (currentTemplate) {
      const updatedTemplate: TemplateType = {
        ...currentTemplate,
        exercises: selectedExercises,
      };
      
      const updateTemplate = useTemplateStore.getState().editTemplate;
      updateTemplate(templateId, updatedTemplate);
  
      router.back()
    }
  };
  

  return (
    <div className='flex py-5 md:py-10'>
      <Wrapper>
        <div className="bg-gray-100 p-4 rounded-2xl">
          <div className='flex justify-between'>
            <button onClick={() => router.back()} className='font-bold'>返回</button>
            <button onClick={handleSaveExercises}>儲存 {selectedExercises.length}</button>
          </div>

          {exerciseTemplates.map((exercise) => (
            <button
              key={exercise.ExerciseId}
              type="button"
              onClick={() => handleToggleExercise(exercise)}
              className={`p-2 rounded m-2 ${selectedExercises.some(ex => ex.ExerciseId === exercise.ExerciseId) ? 'bg-blue-500' : 'bg-white'}`}
            >
              {exercise.name}
            </button>
          ))}
        </div>
      </Wrapper>
    </div>
  );
};

export default AddExercisesPage;
