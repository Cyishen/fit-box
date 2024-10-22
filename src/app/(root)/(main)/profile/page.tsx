import React from 'react'
import { auth } from '@/auth'
import Image from 'next/image'
import Wrapper from '@/components/Wrapper'
import { ChevronRight } from 'lucide-react';

import BannerUnit from './banner';


const ProfilePage = async () => {
  const session = await auth()

  return (
    <section className='flex flex-col bg-[#f3f2f8] h-screen'>
      <Wrapper>
        <h1 className='text-2xl font-bold mt-5'>設定</h1>
        <div className='flex items-center gap-3 mt-5 bg-white px-3 py-1 rounded-lg'>
          <div className='min-w-[50px] min-h-[50px] rounded-full border border-gray-500 flex justify-center items-center'>
            <div className='w-full h-full flex justify-center items-center'>
              {session?.user.image ? (
                <Image
                  src={session?.user?.image || "/icons/dumbbell.svg"}
                  width={46}
                  height={46}
                  alt="google user"
                  className='rounded-full object-contain'
                />
              ) : (
                <p className='rounded-full w-[46px] h-[46px] flex justify-center items-center bg-black text-white text-xl'>
                  {typeof session?.user?.name === 'string' ? session.user.name[0] : 'U'}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col w-full'>
            <div className='flex flex-col leading-4 font-bold'>
              {session?.user ? (
                <p>{session?.user.name}</p>
              ) : (
                <p>Guest</p>
              )}
            </div>

            <div className='text-[12px] text-gray-500 mt-1'>
              <p>健身開始日 2024/10/01</p>
              <p>運動持續 21天 🔥</p>
            </div>
          </div>

          <div className='text-gray-300'>
            <ChevronRight size={20} />
          </div>
        </div>

        <div className='flex flex-col bg-white mt-5 px-3 py-2 rounded-lg'>
          <BannerUnit icon='/icons/body.svg' item='身體數據' />
          <BannerUnit icon='/icons/chart.svg' item='數據分析' />
          <BannerUnit icon='/icons/food.svg' item='飲食紀錄' />
          <BannerUnit icon='/icons/protein.svg' item='蛋白質計算' />
          <BannerUnit item='小工具' />
        </div>

        <div className='flex flex-col bg-white mt-5 px-3 py-2 rounded-lg'>
          <BannerUnit item='其他' />
        </div>
      </Wrapper>
    </section>
  )
}

export default ProfilePage