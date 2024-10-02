"use client"

import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { EllipsisVertical, Trash2, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { usePracticeModal } from '@/lib/use-practice-modal';
import { Exercise } from './[menuId]/[templateId]/ExerciseList';
// import { Button } from '@/components/ui/button';

type Props = {
  iconSrc: string;
  category: string;
  title?: string;
  templateId: string;
  menuId: string;
  onRemove: () => void;
  exercises: Exercise[]
};

const TemplateCard = ({ iconSrc, category, title, onRemove, templateId, menuId, exercises }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isOpenImg, setIsOpenImg] = useState(false);

  const { open } = usePracticeModal();
  const handleOpen = () => {
    open(menuId, templateId);
  };

  // 當圖片有設定路徑, 但資料庫沒實際圖片，用默認圖片
  const defaultIconSrc = "/icons/workout.svg";

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
    <div className='w-full col-span-1 md:col-span-1'>
      <div className='w-full h-full flex flex-col p-3 bg-gray-100 rounded-lg cursor-pointer'>
        <div className='flex items-start justify-between h-full gap-0.5'>
          <p className='font-bold capitalize text-sm line-clamp-2'>{title}</p>

          <div
            className='flex items-center justify-center hover:bg-gray-300 min-w-5 h-5 rounded-full relative'
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
          className='relative w-full mt-2 bg-white rounded-lg hover:bg-yellow-50'
          onClick={handleOpen}
          // onClick={(e) => {
          //   e.stopPropagation();
          //   setIsOpenImg(true);
          // }}
        >
          <p className='absolute top-0 right-0 font-bold text-sm bg-gray-100 px-3 py-1 rounded-bl-lg'>
            {category}
          </p>

          <p className='absolute top-0 left-0 font-bold text-sm px-3 py-1'>
            {exercises.length} 動作
          </p>

          <Image
            src={iconSrc}
            alt={iconSrc}
            width={50}
            height={50}
            className='p-5 w-full'
            onError={(e) => {
              e.currentTarget.src = defaultIconSrc;
            }}
          />
        </div>
      </div>

      {/* <div onClick={() => setIsOpenImg(false)}>
        {isOpenImg && (
          <>
            <div className='fixed inset-0 bg-black/80 flex justify-center items-center z-50' />

            <div
              className="absolute right-1/2 top-0 translate-x-1/2 w-[90vw] max-w-lg min-h-[200px] bg-white text-xl z-[60] rounded-md px-2 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex flex-col items-center w-full'>
                <h3 className='font-bold'>{title}</h3>

                <p className='text-gray-500 text-lg'>堅持練習, 維持體態</p>

                <div className='flex gap-3 w-full mt-10'>
                  <Link href={`/fit/${menuId}/${templateId}/update`} className='w-full'>
                    <Button className='w-full'>編輯</Button>
                  </Link>

                  <Button className='w-full'>開始訓練</Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div> */}
    </div>
  )
}

export default TemplateCard