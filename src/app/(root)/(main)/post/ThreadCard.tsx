"use client"

import { Heart, MessageCircle, Bookmark, Ellipsis } from 'lucide-react'
import React, { useState, useRef } from 'react'

const ThreadCard = () => {
  const scrollContainer = useRef(null)
  const [scrolling, setScrolling] = useState(false)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = (e.target as HTMLDivElement).scrollLeft;
    setScrolling(scrollLeft > 0);
  }

  return (
    <div className="flex flex-col w-full h-full py-3 border-b-[0.5px] bg-white">
      <div className="flex flex-col w-full">
        <div className="flex flex-col px-3 sm:px-6 ml-[44px]">
          <div className="flex gap-2 relative">
            <div className="flex min-w-9 min-h-9 ring-offset-0 ring-1 ring-gray-200 rounded-full overflow-hidden absolute top-0 -left-11 sm:-left-12">
              <div className="flex w-9 h-9 bg-gray-100"></div>
            </div>

            <div className="flex w-full">
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  <p className="text-sm font-bold">Cyi</p>
                  <p className="text-sm text-gray-500">10分鐘</p>
                </div>
                <div className="flex justify-end">
                  <Ellipsis size={16} className="text-gray-500" />
                </div>
              </div>

            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm line-clamp-2">蛋白質</p>
          </div>
        </div>

        {/* 橫向圖片區塊 */}
        <div
          ref={scrollContainer}
          className={`flex mt-2 overflow-x-auto custom-scrollbar pr-5
          ${scrolling ? '' : 'ml-[56px] sm:ml-[68px]'}`}
          onScroll={handleScroll}
        >
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="border border-black border-opacity-40 h-[280px] max-h-[400px] rounded-lg w-[210px] min-w-[210px] overflow-hidden bg-gray-50">
                  <img
                    src='/posts/post1.jpeg'
                    alt='post1'
                    className='h-full object-fill'
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-5 mt-2 text-[10px] h-9 ml-[56px] sm:ml-[68px]">
          <div className="flex items-center gap-1">
            <Heart size={20} />
            <p>101</p>
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle size={20} />
            <p>123</p>
          </div>

          <div className="flex items-center gap-1">
            <Bookmark size={20} />
            <p>11</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
