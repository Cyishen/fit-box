"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { EllipsisVertical, Trash2, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { usePracticeModal } from '@/lib/use-practice-modal';


type Props = {
  iconSrc: string;
  templateCategory: string;
  templateTitle?: string;
  templateId: string;
  menuId: string;
  onRemove: () => void;
  exercises: TemplateExerciseType[]
};

const TemplateCard = ({ iconSrc, templateCategory, templateTitle, onRemove, templateId, menuId, exercises }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { open } = usePracticeModal();
  const handleOpen = () => {
    open(menuId, templateId);
  };

  // 當圖片有設定路徑, 但資料庫沒實際圖片，用默認圖片
  const defaultIconSrc = "/icons/dumbbell.svg";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !((event.target as HTMLElement).closest('#outside-close'))) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className='w-full col-span-1 md:col-span-1' draggable>
      <div className='w-full h-full flex flex-col p-3 bg-slate-200 rounded-lg'>
        <div className='flex items-start justify-between h-full gap-0.5 cursor-grab'>
          <p className='font-bold capitalize text-sm line-clamp-2 no-select'>{templateTitle}</p>

          <div
            className='flex items-center justify-center hover:bg-white min-w-5 h-5 rounded-full relative'
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <EllipsisVertical className='w-3' />

            {isOpen && (
              <div
                id="outside-close"
                className="absolute right-0 top-6 w-fit h-fit bg-white text-xl z-[60] rounded-md shadow-lg overflow-hidden p-2 text-nowrap"
              >
                <div className='flex justify-start'>
                  <button
                    className='flex items-center gap-1 text-sm p-1 font-bold rounded-sm hover:bg-red-400 hover:text-white duration-300'
                    onClick={onRemove}
                  >
                    <Trash2 width={14} /> 刪除
                  </button>
                </div>

                <div className='flex justify-start'>
                  <Link href={`/fit/${menuId}/${templateId}/update`}>
                    <button
                      className='flex items-center gap-1 text-sm p-1 font-bold rounded-sm hover:bg-black hover:text-white duration-300'
                    >
                      <SquarePen width={14} /> 編輯
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className='relative w-full mt-2 bg-white rounded-lg hover:bg-[#66CCFF] cursor-pointer'
          onClick={handleOpen}
        >
          <p className='absolute top-0 right-0 font-bold text-sm bg-slate-200 px-3 py-1 rounded-bl-lg no-select'>
            {templateCategory}
          </p>

          <p className='absolute top-0 left-0 px-3 py-1 text-gray-400 text-[10px] no-select'>
            {exercises.length} 動作
          </p>

          <Image
            src={iconSrc}
            alt={iconSrc}
            width={50}
            height={50}
            className='p-5 w-full pointer-events-none no-select'
            onError={(e) => {
              e.currentTarget.src = defaultIconSrc;
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default TemplateCard