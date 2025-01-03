import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react';
import React from 'react'

type Props = {
  isEditMode: boolean;
  isLoading: boolean
  handleCompleteWorkout: () => void
}

const StaticTitle = ({ isEditMode, handleCompleteWorkout, isLoading }: Props) => {
  return (
    <div className='bg-gray-100'>
      <div className="px-4 pt-4">
        <div className='flex w-full justify-between items-center'>
          <h3 className="font-bold text-xl whitespace-nowrap">
            {isEditMode ? "更新訓練" : "開始訓練"}
          </h3>

          <Button
            onClick={handleCompleteWorkout}
            size='sm'
            className='font-bold'
            disabled={isLoading}
          >
            {isLoading ? (
              <div className='flex justify-center items-center gap-1'>
                <LoaderCircle size={20} className="animate-spin" />
              </div>
            ) : (
              <div className='flex justify-center items-center gap-1'>
                <p>完成</p>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="px-4 py-3">
        <div className='flex items-center justify-end gap-3'>
          <h3 className="font-bold">計時器</h3>
          <p className="font-bold text-3xl border px-2 py-1 rounded-lg animate-pulse">00:00</p>
        </div>
      </div>
    </div>
  )
}

export default StaticTitle