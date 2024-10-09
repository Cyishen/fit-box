"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ListOrdered } from 'lucide-react';
import { Trash2 } from 'lucide-react';


type Props = {
  session: WorkoutSessionType
  handleEditWorkout: (sessionId: string) => void
  handleRemoveWorkoutSession: (sessionId: string) => void
}

const images = [
  '/imgs/cap.png',
  '/imgs/hulk.png',
  '/imgs/iron.png',
  '/imgs/thor.png',
  '/imgs/girl.png',
];

const ShowTrainingCard = ({ session, handleEditWorkout, handleRemoveWorkoutSession }: Props) => {
  const randomImage = images[Math.floor(Math.random() * images.length)];

  const [isSwiped, setIsSwiped] = useState(false);
  const [startX, setStartX] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX); // 記錄觸摸的開始位置
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const distance = startX - e.touches[0].clientX;

    if (distance > 50) {
      setIsSwiped(true);
    }

    else if (distance < 0) {
      setIsSwiped(false);
    }
  };

  // 網頁拖動事件處理
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX); // 記錄滑鼠點擊的開始位置
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons !== 1) return; // 只有按下左鍵時才能滑動

    const distance = startX - e.clientX;

    if (distance > 50) {
      setIsSwiped(true);
    } else if (distance < 0) {
      setIsSwiped(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsSwiped(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className='relative flex p-3 rounded-lg bg-slate-100 hover:bg-blue-100 cursor-pointer group'
      // onClick={() => handleEditWorkout(session.sessionId)}
      style={{
        backgroundImage: `url(${randomImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: '',
      }}
      onTouchStart={handleTouchStart}  // 手機觸摸開始
      onTouchMove={handleTouchMove}    // 手機滑動
      onMouseDown={handleMouseDown}    // 桌面鼠標點擊開始
      onMouseMove={handleMouseMove}    // 桌面滑動
    >
      <div className='flex flex-col w-[70%] p-1 rounded-xl group-hover:bg-white'
        onClick={() => handleEditWorkout(session.sessionId)}
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

      <div className='w-[15%]'>
        <div className="relative h-full cursor-pointer">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full hidden group-hover:flex">
            <span className="h-full flex items-center justify-end text-xs px-3 text-muted-foreground">
              左滑刪除
            </span>
          </div>
        </div>
      </div>

      {/* 左滑刪除 */}
      <div
        ref={cardRef}
        className={`absolute top-0 right-0 h-full flex items-center transition-all duration-300 bg-[#FF3B30] hover:brightness-110 z-10 cursor-pointer rounded-r-2xl
          ${isSwiped ? 'w-20' : 'w-0'}`}
        onClick={() => handleRemoveWorkoutSession(session.sessionId)}
      >
        <Trash2 className=' w-full text-white h-8' />
      </div>
    </div>
  )
}

export default ShowTrainingCard