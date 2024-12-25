"use client"

import React from 'react'
import { Heart, MessageCircle, Bookmark, Ellipsis } from 'lucide-react'

const DCard = () => {
  return (
    <div className="flex flex-col w-full h-full py-3 border-b-[0.5px] bg-white">
      <div className="flex flex-col w-full">
        <div className="flex flex-col px-3 sm:px-6">
          <div className="flex gap-2 items-center">
            <div className="flex min-w-6 min-h-6 ring-offset-0 ring-1 ring-gray-200 rounded-full overflow-hidden">
              <div className="flex w-6 h-6 bg-gray-100"></div>
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
        </div>

        <div className="flex flex-col mt-3 gap-1 px-3 sm:px-6 h-20">
          <div className='flex justify-between gap-1'>
            <div className='flex flex-col'>
              <div className="flex flex-col">
                <p className="text-base line-clamp-1 font-bold">蛋白質蛋白質蛋白質蛋白質蛋白質蛋白質蛋白質</p>
                <p className="text-sm line-clamp-1">蛋白質蛋白質蛋白質蛋白質蛋白質蛋白質蛋白質</p>
              </div>

              <div className="flex gap-5 mt-3 text-[10px]">
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

            <div className="h-20 min-w-20 bg-gray-100 rounded-lg overflow-hidden">
              <img src='/posts/post1.jpeg' alt="setting" className='w-full h-full object-fill' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DCard