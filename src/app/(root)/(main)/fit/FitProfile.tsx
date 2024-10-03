import React from 'react'


const FitProfile = () => {
  return (
    <div className='sticky top-0 flex items-center p-3 bg-white gap-5 z-50'>
      <div className='min-w-14 min-h-14 rounded-full border border-gray-600 flex justify-center items-center'>
        <p className="w-[52px] h-[52px] rounded-full flex justify-center items-center bg-white">
          CY
        </p>
      </div>

      <div className='flex flex-col w-full font-bold'>
        <p className="text-sm">開始訓練: 2024/01/01</p>

        <div className='flex gap-2'>
          <p className="text-sm">已持續: 21天 🔥 👍︎</p>
        </div>

        <p className="text-sm mt-5">基本資料</p>
      </div>
    </div>
  )
}

export default FitProfile