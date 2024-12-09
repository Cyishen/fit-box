import React from 'react'
import { sideCategory } from '@/constants/constants'

interface Props {
  setCategoryState: React.Dispatch<React.SetStateAction<string>>;
  categoryCounts: Record<string, number>;
}

const FitSideBar = ({ setCategoryState, categoryCounts }: Props) => {
  return (
    <div className='flex flex-col w-full'>
      <div className='space-y-2'>
        {sideCategory?.map((item) => (
          <div key={item.label} onClick={() => setCategoryState(item.label)}>
            <div className='flex items-center justify-between bg-white p-1 rounded-sm cursor-pointer hover:bg-gray-200'>
              <p className='font-bold text-sm'>
                {item.label}
              </p>

              <p className='flex items-center justify-center'>
                {categoryCounts[item.label] ? (
                  <span className="text-[10px] text-center">
                    {categoryCounts[item.label]}
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FitSideBar