"use client"

import Link from 'next/link'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'

import FitDashboard from './FitDashboard'
import FitProfile from './FitProfile'

import { useMenuStore } from '@/lib/store'


const FixPage = () => {
  const NOT_USER_MAX_MENU = 2
  const menus = useMenuStore((state) => state.menus);

  const canCreateNewMenu = menus.length < NOT_USER_MAX_MENU;

  return (
    <section>
      <Wrapper>
        <div className='flex sm:py-0 mb-20'>
          <div className="flex flex-col w-full gap-3">
            <FitProfile />
            
            <div className='flex items-center justify-between p-3 rounded-lg bg-gray-100'>
              <h1 className='font-bold text-lg'>你的訓練</h1>

              {canCreateNewMenu ? (
                <Link href='/fit/create-menu'>
                  <Button className='w-fit self-end'>+ 新盒子</Button>
                </Link>
              ) : (
                <Button variant='outline' className='w-fit self-end' disabled>
                  註冊獲得更多盒子🤗
                </Button>
              )}
            </div>

            <div className='mt-5 overflow-hidden'>
              <FitDashboard />
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}

export default FixPage