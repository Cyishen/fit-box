import React from 'react'
import { sideCategory } from '@/constants/constants'

interface Props {
  category: string;
  setCategoryState: React.Dispatch<React.SetStateAction<string>>;
  categoryCounts: Record<string, number>;
}

const FitSideBar = ({ category, setCategoryState, categoryCounts }: Props) => {

  return (
    <div className='flex flex-col w-full'>
      <div className='space-y-2'>
        {sideCategory?.map((item) => (
          <div key={item.label} onClick={() => setCategoryState(item.label)}>
            <div className={`flex items-center justify-between p-1 rounded-sm cursor-pointer 
              ${category === item.label ? 'bg-slate-200' : 'bg-white hover:bg-slate-200'}`}
            >
              <p className='font-bold text-sm'>
                {item.label}
              </p>

              <p className='flex items-center justify-center'>
                {categoryCounts[item.label] ? (
                  <span className="flex items-center justify-center text-[6px] bg-slate-100 rounded-full w-4 h-4">
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