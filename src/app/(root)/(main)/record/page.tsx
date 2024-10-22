import Wrapper from '@/components/Wrapper'
import React from 'react'
import { AnimatedTabsHover } from './AnimatedTabsHover'
import LineChart from './lineChart'
import BarChart from './barChart'


const RecordPage = () => {
  return (
    <section className='flex flex-col bg-[#f3f2f8] h-screen'>
      <Wrapper>
        <h1 className='text-2xl font-bold mt-5'>紀錄</h1>
        <div className='mt-5'>
          <AnimatedTabsHover />
        </div>

        <div className='mt-5'>
          <LineChart />
        </div>

        <div className='mt-5'>
          <BarChart />
        </div>
      </Wrapper>
    </section>
  )
}

export default RecordPage