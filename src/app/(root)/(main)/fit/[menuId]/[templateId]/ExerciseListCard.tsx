import React, { useState, useEffect, useRef } from 'react';
import ExerciseSet from './ExerciseSet';
import { Trash2, ChevronLeft } from 'lucide-react';
import RippleAni from '@/components/RippleAni';
import { SkeletonCard } from './SkeletonCard';

import { exerciseTemplates } from '@/constants/constants';



interface ExerciseListCardProps {
  exercise: TemplateExerciseType;
  handleRemoveExercise: (movementId: string) => void;
  onUpdateSets: (movementId: string, updatedSets: TemplateSetType[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  isLoading: boolean
  templateId: string
  setTemplateState: React.Dispatch<React.SetStateAction<TemplateType>>
}

const ExerciseListCard = ({ exercise, handleRemoveExercise, onUpdateSets, isOpen, onToggle, isLoading, templateId, setTemplateState }: ExerciseListCardProps) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const [startX, setStartX] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);

  const showTotalWeight = exercise.templateSets.reduce((sum, set) => sum + set.totalWeight, 0)

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
    <>
      {isLoading ? <SkeletonCard /> : (
        <div
          className={`relative flex flex-col justify-center rounded-2xl px-1 py-4 bg-white
        ${isOpen ? 'h-full' : 'h-fit'}`}
          onTouchStart={handleTouchStart}  // 手機觸摸開始
          onTouchMove={handleTouchMove}    // 手機滑動
          onMouseDown={handleMouseDown}    // 桌面鼠標點擊開始
          onMouseMove={handleMouseMove}    // 桌面滑動
        >
          <div
            className={`flex justify-between w-full px-2 gap-3 relative transform transition-transform duration-300 rounded-2xl
          ${isSwiped ? '-translate-x-20' : 'translate-x-0'}`}
          >
            <div className='min-w-14 min-h-14 max-w-14 max-h-14 flex justify-center items-center rounded-full border'>
              {exerciseTemplates.map((template, index) => {
                if (template.name === exercise.name) {
                  return (
                    <div key={index}>
                      <img
                        src={template?.iconSrc || '/icons/dumbbell.svg'}
                        alt={exercise.name}
                        width={32}
                        height={32}
                      />
                    </div>
                  );
                }
              })}
            </div>

            <RippleAni className='flex w-full'>
              <div className='flex w-full rounded-md justify-between cursor-pointer hover:bg-blue-100 bg-gray-50'
                onClick={onToggle}
              >
                <div className='flex flex-col justify-center px-1'>
                  <p>{exercise.name}</p>

                  <div className='flex gap-0 text-xs text-muted-foreground'>
                    <p>{exercise.templateSets.length} 組・</p>
                    <p>{showTotalWeight} kg</p>
                  </div>
                </div>
              </div>
            </RippleAni>

            <div className='w-[30%]'>
              <div className="group relative h-full cursor-pointer">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 hidden group-hover:flex items-center justify-center w-full h-full">
                  <ChevronLeft className='w-6 text-gray-200' />
                  <span className="text-gray-400 text-xs px-2 no-select">
                    左滑刪除
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 左滑刪除顯示 */}
          <div
            ref={cardRef}
            className={`absolute top-0 right-0 h-full flex items-center transition-all duration-300 bg-[#FF3B30] hover:brightness-110 z-10 cursor-pointer rounded-r-2xl
          ${isSwiped ? 'w-20' : 'w-0'}`}
            onClick={() => handleRemoveExercise(exercise.movementId)}
          >
            <Trash2 className=' w-full text-white h-8' />
          </div>

          {/* 組數設定顯示 */}
          {isOpen && (
            <ExerciseSet
              exercise={exercise}
              sets={exercise.templateSets}
              movementId={exercise.movementId}
              onUpdateSets={onUpdateSets}
              templateId={templateId}
              isSingleWeight={exercise?.isSingleWeight}
              setTemplateState={setTemplateState}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ExerciseListCard;