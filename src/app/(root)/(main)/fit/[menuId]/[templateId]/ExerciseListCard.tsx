import React, { useState, useEffect, useRef } from 'react';
import { Exercise, Set } from './ExerciseList';
import Image from 'next/image';
import ExerciseSet from './ExerciseSet';
import { Trash2, } from 'lucide-react';

interface ExerciseListCardProps {
  exercise: Exercise;
  handleRemoveExercise: (exerciseId: string) => void;
  onUpdateSets: (exerciseId: string, updatedSets: Set[]) => void;
}

const ExerciseListCard = ({ exercise, handleRemoveExercise, onUpdateSets }: ExerciseListCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwiped, setIsSwiped] = useState(false);
  const [startX, setStartX] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);

  // 手機觸摸事件處理
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX); // 記錄觸摸的開始位置
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const distance = startX - e.touches[0].clientX;
    
    if (distance > 50) {
      setIsSwiped(true);
    } 

    else if (distance < 0 ) {
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
      className={`relative rounded-md p-2 bg-white ${isOpen ? 'h-full' : 'h-24'} overflow-hidden`}
      onTouchStart={handleTouchStart}  // 手機觸摸開始
      onTouchMove={handleTouchMove}    // 手機滑動
      onMouseDown={handleMouseDown}    // 桌面鼠標點擊開始
      onMouseMove={handleMouseMove}    // 桌面滑動
    >
      <div
        className={`flex justify-between w-full p-0 gap-3 relative transform transition-transform duration-300 
          ${isSwiped ? '-translate-x-20' : 'translate-x-0'}`}
      >
        <div className='min-w-20 min-h-20 max-w-20 max-h-20 flex justify-center items-center rounded-full border'>
          <Image src="/icons/dumbbell.svg" alt='' width={50} height={50} className='w-full h-full' />
        </div>

        <div className='flex w-full rounded-md justify-between cursor-pointer hover:bg-gray-50'
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className='flex flex-col w-full p-1'>
            <p>{exercise.name}</p>
            <p>{exercise.sets.length} 組</p>
          </div>
        </div>

        <div className='w-[30%]'>
        </div>
      </div>

      {/* 刪除按鈕 */}
      <div
        ref={cardRef}
        className={`absolute top-0 right-0 h-full flex items-center transition-all duration-300 overflow-hidden bg-[#FF3B30] hover:brightness-110 z-10 cursor-pointer 
          ${isSwiped ? 'w-20' : 'w-0'}`}
        onClick={() => handleRemoveExercise(exercise.ExerciseId)}
      >
        <Trash2 className=' w-full text-white h-8' />
      </div>

      {/* 組數設定顯示 */}
      {isOpen && (
        <ExerciseSet
          sets={exercise.sets}
          exerciseId={exercise.ExerciseId}
          onUpdateSets={onUpdateSets}
        />
      )}
    </div>
  );
};

export default ExerciseListCard;
