import Wrapper from '@/components/Wrapper'
import React from 'react'
import LineChart from './lineChart'
import BarChart from './barChart'
import PieChart from './pieChart'

import { auth } from '@/auth'
import { getCategorySummaryByUserIdForRange } from '@/actions/user-create'

// import FetchSummary from './fetchSummary'


const RecordPage = async () => {
  const session = await auth();
  const userId = session?.user?.id

  const userYearSummaryData = await getCategorySummaryByUserIdForRange(userId as string, 'year');
  const userWeekSummaryData = await getCategorySummaryByUserIdForRange(userId as string, 'week');

  const[ 
    userYearSummary,
    userWeekSummary 
  ] = await Promise.all([ 
    userYearSummaryData,
    userWeekSummaryData 
  ]) 

  return (
    <section className='flex flex-col bg-[#f3f2f8] h-full no-select'>
      <Wrapper className='mb-48'>
        <h1 className='text-2xl font-bold mt-5'>紀錄</h1>
        {/* <FetchSummary userWeekSummary={userYearSummary}/> */}

        <div className='mt-5'>
          <LineChart userYearSummary={userYearSummary}/>
        </div>

        <div className='mt-5'>
          <BarChart userWeekSummary={userWeekSummary}/>
        </div>

        <div className='mt-5'>
          <PieChart />
        </div>
      </Wrapper>
    </section>
  )
}

export default RecordPage