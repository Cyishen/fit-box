"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ListOrdered, Trash2 } from 'lucide-react';

import RippleAni from '@/components/RippleAni';
import { multiFormatDateString } from '@/lib/TimeFn/Timer';


const heroImage = [
  '/imgs/cap.png',
  '/imgs/hulk.png',
  '/imgs/iron.png',
  '/imgs/thor.png',
  '/imgs/girl.png',
];

type Props = {
  sessionCards: WorkoutSessionType
  handleRemoveWorkoutSession: (cardSessionId: string) => void
  handleEditWorkout: (cardSessionId: string) => void
}

const ShowTrainingCard = ({ sessionCards, handleRemoveWorkoutSession, handleEditWorkout }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const randomImage = heroImage[Math.floor(Math.random() * heroImage.length)];

  const [isSwiped, setIsSwiped] = useState(false);
  const [startX, setStartX] = useState(0);

  // 手機觸摸事件處理
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
  //   if(userId) {
  //     // 資料庫
  //     if (sessionCards) {
  //       router.push(`/fit/workout/${sessionCards.menuId}/${sessionCards.templateId}/${sessionId}`);
  //     }
  //     localStorage.setItem('currentSessionId', sessionId);
  //   } else {
  //     // 本地
  //     const sessionToEdit = workoutSessions.find(session => session.cardSessionId === sessionId);

  //     if (sessionToEdit) {
  //       router.push(`/fit/workout/${sessionToEdit.menuId}/${sessionToEdit.templateId}/${sessionId}`);
  //     }
  //     localStorage.setItem('currentSessionId', sessionId);
  //   }
  // };

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
    <RippleAni>
      <div
        className='relative flex py-2 px-2 rounded-lg bg-slate-100 hover:bg-blue-100 cursor-pointer group'
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
        <div className={`flex w-full
        ${isSwiped ? '-translate-x-20' : 'translate-x-0'}`}
        >
          <div className='flex w-[70%] flex-col px-2 rounded-xl bg-white py-1 overflow-hidden'
            onClick={() => handleEditWorkout(sessionCards?.cardSessionId)}
          >
            <p className='font-bold line-clamp-1'>{sessionCards?.templateTitle}</p>

            <div className='flex items-center gap-1 text-[10px]'>
              <div className='flex items-center'>
                <div className='w-5 h-5'>
                  <Image src='/icons/dumbbell.svg' width={20} height={20} alt='dumbbell' />
                </div>
                <p className='flex items-center justify-center border px-1 min-h-5 rounded-full bg-black text-white group-hover:text-[#66CCFF] whitespace-nowrap'>
                  {sessionCards?.exercises?.length} 動作
                </p>
              </div>

              <div className='flex items-center gap-1'>
                <ListOrdered width={16} className='group-hover:text-[#66CCFF]'/>
                <p className='flex items-center justify-center border px-2 min-h-5 rounded-full bg-black text-white group-hover:text-[#66CCFF] whitespace-nowrap'>
                  {sessionCards?.exercises?.reduce((total, e) => total + e.sets.length, 0)} 組
                </p>
              </div>

              <div className='text-muted-foreground line-clamp-1'>
                <p>{multiFormatDateString(sessionCards?.createdAt as string)}</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col w-[15%]'>
            <div className="relative h-full cursor-pointer">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full hidden group-hover:flex">
                <span className="h-full flex items-center justify-end text-[10px] px-3 text-gray-400 no-select">
                  左滑刪除
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 左滑刪除 */}
        <div
          ref={cardRef}
          className={`absolute top-0 right-0 h-full flex items-center transition-all duration-300 bg-[#FF3B30] hover:brightness-110 z-10 cursor-pointer rounded-r-2xl
          ${isSwiped ? 'w-20' : 'w-0'}`}
          onClick={() => handleRemoveWorkoutSession(sessionCards?.cardSessionId)}
        >
          <Trash2 className=' w-full text-white h-8' />
        </div>
      </div>
    </RippleAni>
  )
}

export default ShowTrainingCard