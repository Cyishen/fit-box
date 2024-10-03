"use client"

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { Exercise, Set } from './ExerciseList';
import Image from 'next/image';
import ExerciseSet from './ExerciseSet';


interface ExerciseListCardProps {
  exercise: Exercise;
  handleRemoveExercise: (exerciseId: string) => void;
  onUpdateSets: (exerciseId: string, updatedSets: Set[]) => void;
}


const ExerciseListCard = ({ exercise, handleRemoveExercise, onUpdateSets }: ExerciseListCardProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`rounded-md bg-white ${isOpen ? 'h-full' : 'h-24'}`}>
      <div className='flex justify-between w-full p-2 gap-3 relative'>
        <div className='min-w-20 min-h-20 max-w-20 max-h-20 flex justify-center items-center rounded-full border'>
          <Image src="/icons/dumbbell.svg" alt='' width={50} height={50} className='w-full h-full' />
        </div>

        <div className='flex w-full rounded-md justify-between cursor-pointer hover:bg-gray-50'
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className='flex flex-col w-full p-1'>
            <p>{exercise.name}</p>
            <p>{exercise.sets.length} 組</p>
          </div>
        </div>

        <div className='absolute top-2 right-2'>
          <Button
            variant='destructive'
            size='sm'
            type='button'
            onClick={() => handleRemoveExercise(exercise.ExerciseId)}
          >
            刪除
          </Button>
        </div>
      </div>

      {isOpen && (
        <ExerciseSet
          sets={exercise.sets}
          exerciseId={exercise.ExerciseId}
          onUpdateSets={onUpdateSets}
        />
      )}
    </div>
  )
}

export default ExerciseListCard