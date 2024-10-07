"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTemplateStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import FitSideBar from './FitSideBar';
import { exerciseTemplates } from '@/constants/constants';


const ExercisePicker = ({ params }: { params: { templateId: string } }) => {
  const router = useRouter();
  const { templateId } = params;

  const templates = useTemplateStore(state => state.templates);
  const currentTemplate = templates.find(template => template.cardId === templateId);

  const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>([]);

  useEffect(() => {
    if (currentTemplate) {
      setSelectedExercises(currentTemplate.exercises);
    }
  }, [currentTemplate]);

  const handleToggleExercise = (exercise: ExerciseType) => {
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
    <div className='flex pb-10 sm:pt-10 bg-gray-100 sm:bg-white h-screen'>
      <div className='forMobile sm:forWeb'>
        <div className="bg-gray-100 p-4 sm:rounded-2xl">
          <div className='flex justify-between'>
            <Button size='sm' onClick={() => router.back()} className='font-bold'>返回</Button>
            <Button size='sm' type='button' onClick={handleSaveExercises}>儲存 {selectedExercises.length}</Button>
          </div>

          <div className='flex mt-5 gap-3'>
            <div className='w-32'>
              <h3 className="font-bold">選擇動作</h3>
              <hr className='my-2'/>

              <FitSideBar />
            </div>

            <div className='w-full'>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {exerciseTemplates.map((exercise) => (
                  <div
                    key={exercise.ExerciseId}
                    onClick={() => handleToggleExercise(exercise)}
                    className={`p-2 rounded-md cursor-pointer 
                    ${selectedExercises.some(select => select.ExerciseId === exercise.ExerciseId) ? 'bg-[#66CCFF] ring-1 ring-offset-2 ring-blue-500' : 'bg-white'}`
                    }
                  >
                    <div key={exercise.ExerciseId}>
                      <div className="p-2">
                        <div className="flex flex-col items-center">
                          <Image
                            src='/icons/dumbbell.svg'
                            alt={exercise.name}
                            width={36}
                            height={36}
                          />
                          <p className={`text-sm mt-2 ${selectedExercises.some(select => select.ExerciseId === exercise.ExerciseId) ? 'text-black' : 'text-muted-foreground'}`}>
                            {exercise.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePicker;
