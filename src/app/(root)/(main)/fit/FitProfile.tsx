import { useWorkoutStore } from '@/lib/store';
import React from 'react'


const FitProfile = () => {
  const { workoutSessions } = useWorkoutStore();

  return (
    <div className='sticky top-0 flex items-center p-3 bg-white gap-5 z-50'>
      <div className='min-w-14 min-h-14 rounded-full border border-gray-600 flex justify-center items-center'>
        <p className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-gray-100">
          CY
        </p>
      </div>

      <div className='flex flex-col w-full font-bold'>
        <p className="text-sm">健身起始日: 2024/01/01</p>

        <div className='flex gap-2'>
          <p className="text-sm">已持續 21天 🔥 /</p>
          <p className="text-sm">累積訓練 {workoutSessions.length}天👍︎</p>
        </div>

        <p className="text-sm mt-5">基本資料</p>
      </div>
    </div>
  )
}

export default FitProfile