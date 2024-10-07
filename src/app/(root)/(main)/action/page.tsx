"use client";


import React, { useState } from 'react';
import Image from 'next/image';
import FitSideBar from '../fit/[menuId]/[templateId]/create-template/exercise-picker/FitSideBar';
import { exerciseTemplates } from '@/constants/constants';


const ActionPage = () => {
  const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>([]);

  const handleToggleExercise = (exercise: ExerciseType) => {
    const isSelected = selectedExercises.some(ex => ex.exerciseId === exercise.exerciseId);

    if (isSelected) {
      setSelectedExercises(selectedExercises.filter(ex => ex.exerciseId !== exercise.exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };


  return (
    <div className='flex pb-10 sm:pt-10 bg-gray-100 sm:bg-white h-screen'>
      <div className='forMobile sm:forWeb'>
        <div className="bg-gray-100 p-4 sm:rounded-2xl">
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
                    key={exercise.exerciseId}
                    onClick={() => handleToggleExercise(exercise)}
                    className={`p-2 rounded-md cursor-pointer 
                    ${selectedExercises.some(select => select.exerciseId === exercise.exerciseId) ? 'bg-[#66CCFF] ring-1 ring-offset-2 ring-blue-500' : 'bg-white'}`
                    }
                  >
                    <div key={exercise.exerciseId}>
                      <div className="p-2">
                        <div className="flex flex-col items-center">
                          <Image
                            src='/icons/dumbbell.svg'
                            alt={exercise.name}
                            width={36}
                            height={36}
                          />
                          <p className={`text-sm mt-2 ${selectedExercises.some(select => select.exerciseId === exercise.exerciseId) ? 'text-black' : 'text-muted-foreground'}`}>
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

export default ActionPage;
