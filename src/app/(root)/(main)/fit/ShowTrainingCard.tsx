import React from 'react'
import Image from 'next/image'
import { ListOrdered } from 'lucide-react';

type Props = {
  session: WorkoutSessionType
  handleEditWorkout: (sessionId: string) => void
}

const images = [
  '/imgs/cap.png',
  '/imgs/hulk.png',
  '/imgs/iron.png',
  '/imgs/thor.png',
  '/imgs/girl.png',
];

// 随机选择一个图片 URL
const randomImage = images[Math.floor(Math.random() * images.length)];

const ShowTrainingCard = ({ session, handleEditWorkout }: Props) => {
  return (
    <div
      className='flex flex-col p-3 rounded-lg bg-slate-100 hover:bg-blue-100 cursor-pointer group'
      onClick={() => handleEditWorkout(session.sessionId)}
      style={{
        backgroundImage: `url(${randomImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: '',
      }}
    >
      <p className='font-bold'>{session.templateTitle}</p>

      <div className='flex items-center gap-1 text-[10px]'>
        <div className='flex items-center'>
          <div>
            <Image src='/icons/dumbbell.svg' width={20} height={20} alt='dumbbell' />
          </div>
          <p className='border px-1 rounded-full bg-black text-white group-hover:text-[#66CCFF]'>{session.exercises.length} 動作</p>
        </div>

        <div className='flex items-center gap-1'>
          <ListOrdered width={16} />
          <p className='border px-1 rounded-full bg-black text-white group-hover:text-[#66CCFF]'>共 {session.exercises.reduce((total, e) => total + e.sets.length, 0)} 組</p>
        </div>
      </div>
    </div>
  )
}

export default ShowTrainingCard