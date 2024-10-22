import React from 'react'
import { ChevronRight } from 'lucide-react';

type Props = {
  icon?: string
  item: string
}

const BannerUnit = ({ icon, item  }: Props) => {
  return (
    <div className='flex items-center justify-between py-2 hover:bg-slate-100'>
      <div className='flex items-center gap-3'>
        <img src={icon || "/icons/setting.svg"} alt='body' width={30} height={30}/>
        <p className='text-sm'>{item}</p>
      </div>
      <div className='text-gray-300'>
        <ChevronRight size={20} />
      </div>
    </div>
  )
}

export default BannerUnit