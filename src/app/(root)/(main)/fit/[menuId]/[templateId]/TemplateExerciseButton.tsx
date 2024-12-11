"use client"


import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CopyPlus } from 'lucide-react';

import ExercisePickerSheet from './ExercisePickerSheet'


type Props = {
  templateId?: string
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
}
const TemplateExerciseButton = ({ templateId, setTemplateState }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button
        type="button"
        className='w-8 h-8 flex justify-center items-center duration-300 rounded-full'
        onClick={() => setIsOpen(true)}
      >
        <div className='min-w-8 min-h-8 rounded-full flex justify-center items-center'>
          <CopyPlus size={14} />
        </div>
      </Button>

      <ExercisePickerSheet isOpen={isOpen} setIsOpen={setIsOpen} templateId={templateId} setTemplateState={setTemplateState}/>
    </div>
  )
}

export default TemplateExerciseButton