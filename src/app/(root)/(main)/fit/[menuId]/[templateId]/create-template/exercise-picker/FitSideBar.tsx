import React from 'react'
import { sideCategory } from '@/constants/constants'

const FitSideBar = () => {
  return (
    <div className='flex flex-col w-full'>
      <div className='space-y-2'>
        {sideCategory?.map((item) => (
          <div key={item.label}>
            <div className='bg-white p-1 rounded cursor-pointer hover:bg-gray-200'>
              <p className='font-bold text-sm'> {item.label} </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FitSideBar