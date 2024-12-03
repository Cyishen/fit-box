import Wrapper from '@/components/Wrapper'
import React from 'react'
import LineChart from './lineChart'
import BarChart from './barChart'
import PieChart from './pieChart'

import { auth } from '@/auth'
import { getCategorySummaryByUserIdForLineChart, getCategorySummaryByUserIdForBarChart } from '@/actions/user-create'



const RecordPage = async () => {
  const session = await auth();
  const userId = session?.user?.id

  const userYearSummaryData = getCategorySummaryByUserIdForLineChart(userId as string, 'year');

  const userThisWeekSummaryData = getCategorySummaryByUserIdForBarChart(userId as string, '週', false);
  const userLastWeekSummaryData = getCategorySummaryByUserIdForBarChart(userId as string, '週', true);
  const userThisMonthSummaryData = getCategorySummaryByUserIdForBarChart(userId as string, '月', false);
  const userLastMonthSummaryData = getCategorySummaryByUserIdForBarChart(userId as string, '月', true);
  const userThisYearSummaryData = getCategorySummaryByUserIdForBarChart(userId as string, '年', false);
  const userLastYearSummaryData = getCategorySummaryByUserIdForBarChart(userId as string, '年', true);

  const [
    userYearSummary,
    userThisWeekSummary,
    userLastWeekSummary,
    userThisMonthSummary,
    userLastMonthSummary,
    userThisYearSummary,
    userLastYearSummary
  ] = await Promise.all([
    userYearSummaryData,
    userThisWeekSummaryData,
    userLastWeekSummaryData,
    userThisMonthSummaryData,
    userLastMonthSummaryData,
    userThisYearSummaryData,
    userLastYearSummaryData
  ])

  return (
    <section className='flex flex-col bg-[#f3f2f8] h-full no-select'>
      <Wrapper className='mb-48'>
        <h1 className='text-2xl font-bold mt-5'>紀錄</h1>

        <div className='mt-5'>
          <LineChart userYearSummary={userYearSummary} />
        </div>

        <div className='mt-5'>
          <BarChart
            userThisWeekSummary={userThisWeekSummary}
            userLastWeekSummary={userLastWeekSummary}
            userThisMonthSummary={userThisMonthSummary}
            userLastMonthSummary={userLastMonthSummary}
            userThisYearSummary={userThisYearSummary}
            userLastYearSummary={userLastYearSummary}
          />
        </div>

        <div className='mt-5'>
          <PieChart userThisYearSummary={userThisYearSummary}/>
        </div>
      </Wrapper>
    </section>
  )
}

export default RecordPage