import Link from 'next/link'
import Wrapper from '@/components/Wrapper'
import { Button } from '@/components/ui/button'

import FitDashboard from './FitDashboard'
import FitProfile from './FitProfile'

const FixPage = () => {
  return (
    <section>
      <Wrapper>
        <div className='flex sm:py-10 mb-20'>
          <div className="flex flex-col w-full gap-3">
            <FitProfile />
            
            <div className='flex items-center justify-between p-3 rounded-lg bg-gray-100'>
              <h1 className='font-bold text-lg'>你的訓練</h1>

              <Link href='/fit/create-menu'>
                <Button className='w-fit self-end'>+ 新盒子</Button>
              </Link>
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