"use client"


import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CopyPlus } from 'lucide-react';

import ExercisePickerSheet from './ExercisePickerSheet'


type Props = {
  templateId?: string
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>;
}
const TemplateExerciseButton = ({ templateId, setTemplateState }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 禁用背景滾動
      document.body.style.overflow = 'hidden';
    } else {
      // 恢復背景滾動
      document.body.style.overflow = 'auto';
    }
  
    return () => {
      // 清理
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);


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