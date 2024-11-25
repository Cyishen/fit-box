"use client";

import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

import AnimatedBackground from './AnimatedBackground';

import { useSession } from "next-auth/react"
import { useWorkoutStore } from '@/lib/store';
import { getDateRange } from '@/lib/TimeFn/Timer';


const categories = ["胸", "背", "腿", "肩", "二頭", "三頭"] as const;
type Category = typeof categories[number];

type CategoryType = {
  userId: string,
  workoutSessionId: string
  date: string | Date,
  totalSessionSets: number,
  totalSessionWeight: number,
  categorySummaries: {
    exerciseCategory: string,
    totalCategorySets: number,
    totalCategoryWeight: number
  }[];
}

export type WorkoutRecord = {
  category: string;
  count: number;
};

export interface Props {
  userThisWeekSummary: CategoryType[]
  userLastWeekSummary: CategoryType[]
  userThisMonthSummary: CategoryType[]
  userLastMonthSummary: CategoryType[]
  userThisYearSummary: CategoryType[]
  userLastYearSummary: CategoryType[]
}


const BarChart = ({ userThisWeekSummary, userLastWeekSummary, userThisMonthSummary, userLastMonthSummary, userThisYearSummary, userLastYearSummary }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [timeFrame, setTimeFrame] = useState<'週' | '月' | '年'>('週');
  // 本次區間數據管理
  const [chartData, setChartData] = useState<{ category: Category, count: number }[]>([]);
  // 上個區間數據管理
  const [lastChartData, setLastChartData] = useState<{ category: Category, count: number }[]>([]);

  // 無登入本地訓練卡
  const { workoutSessions } = useWorkoutStore();

  //本地分類
  const calculateChartData = (
    sessions: WorkoutSessionType[],
    timeFrame: string,
    isPrevious: boolean,
  ) => {
    const { start, end } = getDateRange(timeFrame, new Date(), isPrevious);

    const filteredSessions = sessions.filter((session) => {
      const sessionDate = new Date(session.date);

      const startDate = new Date(start);
      const endDate = new Date(end);

      // 清除 startDate 和 endDate 的時間部分，僅比較日期
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return sessionDate >= startDate && sessionDate <= endDate;
    });

    const categoryCounts: { [key: string]: number } = {};
    filteredSessions.forEach(session => {
      session.exercises.forEach(exercise => {
        const category = exercise.exerciseCategory;
        const setsCount = exercise.sets.filter(set => set.isCompleted).length;
        categoryCounts[category] = (categoryCounts[category] || 0) + setsCount;
      });
    });

    return categories.map(category => ({
      category,
      count: categoryCounts[category] || 0,
    }));
  }

  //資料庫分類
  const filterUserData = (userData: CategoryType[]) => {
    const categoryCounts: { [key: string]: number } = {};

    userData.forEach(item => {
      item.categorySummaries.forEach(summary => {
        const category = summary.exerciseCategory;
        const setsCount = summary.totalCategorySets;
        categoryCounts[category] = (categoryCounts[category] || 0) + setsCount;
      });
    });

    return categories.map(category => ({
      category,
      count: categoryCounts[category] || 0,
    }));
  };


  useEffect(() => {
    let thisPeriodData: { category: Category, count: number }[] = [];
    let lastPeriodData: { category: Category, count: number }[] = [];

    if (userId) {
      if (timeFrame === '週') {
        thisPeriodData = filterUserData(userThisWeekSummary);
        lastPeriodData = filterUserData(userLastWeekSummary);
      } else if (timeFrame === '月') {
        thisPeriodData = filterUserData(userThisMonthSummary);
        lastPeriodData = filterUserData(userLastMonthSummary);
      } else if (timeFrame === '年') {
        thisPeriodData = filterUserData(userThisYearSummary);
        lastPeriodData = filterUserData(userLastYearSummary);
      }

      setChartData(thisPeriodData);
      setLastChartData(lastPeriodData);
    } else {
      const thisPeriodData = calculateChartData(workoutSessions, timeFrame, false);
      const lastPeriodData = calculateChartData(workoutSessions, timeFrame, true);

      setChartData(thisPeriodData);
      setLastChartData(lastPeriodData);
    }
  }, [timeFrame, userId, userLastMonthSummary, userLastWeekSummary, userLastYearSummary, userThisMonthSummary, userThisWeekSummary, userThisYearSummary, workoutSessions]);

  // 寫法重複定義日期
  // useEffect(() => {
  //   if (userId) {


  //   } else {
  //     // 無用戶的本地數據
  //     // TODO 本次區間定義 
  //     // 第一步定義: 本週、本月、本年
  //     const startDate = new Date();
  //     const endDate = new Date();

  //     if (timeFrame === '週') {
  //       startDate.setDate(startDate.getDate() - (startDate.getDay() || 7) + 1);
  //       endDate.setDate(startDate.getDate() + 6);  // 本週的週日
  //     } else if (timeFrame === '月') {
  //       startDate.setDate(1); // 當月的開始
  //       endDate.setMonth(endDate.getMonth() + 1);
  //       endDate.setDate(0); // 設置為當月的最後一天
  //     } else if (timeFrame === '年') {
  //       startDate.setMonth(0, 1); // 當年的開始（1月1日）
  //       endDate.setMonth(11, 31); // 當年的結束（12月31日）
  //     }
  //     // 第二步: 篩選日期內的數據
  //     const filteredSessions = workoutSessions.filter(session => {
  //       const sessionDate = new Date(session.date);
  //       const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

  //       const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  //       const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  //       return sessionDateOnly >= startDateOnly && sessionDateOnly <= endDateOnly;
  //     });

  //     // TODO 上個區間定義 
  //     // 第一步定義:上週、上月、上年區間
  //     const lastWeekStartDate = new Date(startDate);
  //     lastWeekStartDate.setDate(lastWeekStartDate.getDate() - 7); // 上週開始日期
  //     const lastWeekEndDate = new Date(lastWeekStartDate);
  //     lastWeekEndDate.setDate(lastWeekStartDate.getDate() + 6); // 上週結束日期

  //     const lastMonthStartDate = new Date(startDate);
  //     lastMonthStartDate.setMonth(lastMonthStartDate.getMonth() - 1); // 上月
  //     lastMonthStartDate.setDate(1); // 上月的開始日期
  //     const lastMonthEndDate = new Date(lastMonthStartDate);
  //     lastMonthEndDate.setMonth(lastMonthStartDate.getMonth() + 1);
  //     lastMonthEndDate.setDate(0); // 上月的最後一天

  //     const lastYearStartDate = new Date(startDate);
  //     lastYearStartDate.setFullYear(lastYearStartDate.getFullYear() - 1); // 去年
  //     lastYearStartDate.setMonth(0, 1); // 去年1月1日
  //     const lastYearEndDate = new Date(lastYearStartDate);
  //     lastYearEndDate.setMonth(11, 31); // 去年12月31日

  //     let lastStartDate, lastEndDate;
  //     if (timeFrame === '週') {
  //       lastStartDate = lastWeekStartDate;
  //       lastEndDate = lastWeekEndDate;
  //     } else if (timeFrame === '月') {
  //       lastStartDate = lastMonthStartDate;
  //       lastEndDate = lastMonthEndDate;
  //     } else if (timeFrame === '年') {
  //       lastStartDate = lastYearStartDate;
  //       lastEndDate = lastYearEndDate;
  //     }
  //     // 第二步: 篩選日期內的數據
  //     const filteredLast = workoutSessions.filter(session => {
  //       const sessionDate = new Date(session.date);
  //       return sessionDate >= lastStartDate! && sessionDate <= lastEndDate!;
  //     });

  //     // todo 統計本次區間數據
  //     const categoryCounts: { [key: string]: number } = {};
  //     filteredSessions.forEach(session => {
  //       session.exercises.forEach(exercise => {
  //         const category = exercise.exerciseCategory;
  //         const setsCount = exercise.sets.filter(set => set.isCompleted).length;
  //         categoryCounts[category] = (categoryCounts[category] || 0) + setsCount;
  //       });
  //     });
  //     const chartData = categories.map(category => ({
  //       category,
  //       count: categoryCounts[category] || 0,
  //     }));
  //     setChartData(chartData);

  //     // todo 統計上次區間數據
  //     const lastCategoryCounts: { [key: string]: number } = {};
  //     filteredLast.forEach(session => {
  //       session.exercises.forEach(exercise => {
  //         const category = exercise.exerciseCategory;
  //         const setsCount = exercise.sets.filter(set => set.isCompleted).length;
  //         lastCategoryCounts[category] = (lastCategoryCounts[category] || 0) + setsCount;
  //       });
  //     });
  //     const LastChartData = categories.map(category => ({
  //       category,
  //       count: lastCategoryCounts[category] || 0,
  //     }));
  //     setLastChartData(LastChartData);

  //     // 模擬假數據
  //     // const mockData = generateMockData(timeFrame);
  //     // setChartData(mockData);
  //   }
  // }, [timeFrame, userId, workoutSessions]);

  const getSubtext = (timeFrame: string): string => {
    if (timeFrame === '週') {
      return '與上週對比 (本週 vs 上週)';
    } else if (timeFrame === '月') {
      return '與上月對比 (本月 vs 上月)';
    } else if (timeFrame === '年') {
      return '與去年對比 (今年 vs 去年)';
    }
    return ''; // 預設情況
  };
  const option: EChartsOption = {
    title: {
      text: "完成組數 🥳",
      subtext: getSubtext(timeFrame),
      itemGap: 5,
      top: 5,
      textStyle: {
        fontSize: 14
      },
      subtextStyle: {
        fontSize: 10
      }
    },
    tooltip: {
      trigger: 'axis',
      alwaysShowContent: true,
      position: ['70%', '3%'],
      backgroundColor: 'transparent',
      shadowColor: 'none',
      padding: 5,
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.1)',
      textStyle: {
        fontSize: 11,
        color: 'black',
        fontWeight: 'bold',
      },
      axisPointer: {
        type: "shadow",
      }, 
    },
    grid: {
      left: '0%',
      right: '1%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => item.category)
    },
    yAxis: {
      type: 'value',
      boundaryGap: ['0%', '10%'],
      // name: '組數',
      nameLocation: 'end',
      axisLabel: {
        fontSize: 8,
      },
      nameTextStyle: {
        align: "left",
        fontSize: 12,
      }
    },
    series: [
      {
        name: '本次',
        type: 'bar',
        data: chartData.map(item => item.count),
        label: {
          show: true,
          position: 'top',
          fontSize: 8,
          fontWeight: 'bold',
          // formatter: (params: { value: number }) => `${params.value}`
        },
        itemStyle: {
          color: (params: { dataIndex: number }) => {
            switch (chartData[params.dataIndex].category) {
              case '胸':
                return '#3B82F6'; // 藍色
              case '背':
                return '#4B5563'; // 灰色
              case '腿':
                return '#EF4444'; // 紅色
              case '肩':
                return '#FBBF24'; // 黃色
              case '二頭':
                return '#8B5CF6'; // 紫色
              case '三頭':
                return '#10B981'; // 綠色
              default:
                return '#000000'; // 預設顏色
            }
          }
        }
      },
      {
        name: '上次',
        type: 'bar',
        data: lastChartData.map(item => item.count),
        label: {
          show: true,
          position: 'top',
          fontSize: 8,
          color: 'gray',
        },
        itemStyle: {
          color: 'rgba(59, 130, 246, 0.1)',
        }
      }
    ],
  };

  return (
    <div className='flex flex-col p-1 rounded-lg border'>
      <AnimatedTabsHover onChange={setTimeFrame} activeTab={timeFrame} />
      <div className='h-[300px]'>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
          className='z-10'
        />
      </div>
    </div>
  );
};

export default BarChart;


// 生成假資料的函式
export const generateMockData = (timeFrame: '週' | '月' | '年') => {
  const data: { category: Category, count: number }[] = [];
  const randomCounts = {
    胸: [10, 20],
    背: [8, 20],
    腿: [8, 20],
    肩: [6, 20],
    二頭: [5, 12],
    三頭: [5, 12],
  };

  categories.forEach(category => {
    let count;
    switch (timeFrame) {
      case '週':
        count = randomCounts[category][0] + Math.floor(Math.random() * (randomCounts[category][1] - randomCounts[category][0] + 1));
        break;
      case '月':
        count = Math.floor((randomCounts[category][0] + randomCounts[category][1]) / 2) * 4; // 每月
        break;
      case '年':
        count = Math.floor((randomCounts[category][0] + randomCounts[category][1]) / 2) * 52; // 每年
        break;
      default:
        count = 0;
    }
    data.push({ category, count });
  });

  return data;
};

// 動態選單
interface AnimatedTabsHoverProps {
  activeTab: '週' | '月' | '年';
  onChange: (tab: '週' | '月' | '年') => void;
}
function AnimatedTabsHover({ activeTab, onChange }: AnimatedTabsHoverProps) {
  const TABS = [
    { label: '週', icon: null },
    { label: '月', icon: null },
    { label: '年', icon: null },
  ];

  return (
    <div className='flex space-x-2 p-1 bg-slate-200 rounded-lg'>
      <AnimatedBackground
        defaultValue={activeTab}
        className='rounded-lg bg-white bg-opacity-80'
        transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.3,
        }}
        enableHover
      >
        {TABS.map((tab) => (
          <button
            key={tab.label}
            data-id={tab.label}
            type='button'
            onClick={() => onChange(tab.label as '週' | '月' | '年')}
            className={`inline-flex h-8 w-full items-center justify-center transition-colors duration-100 z-10 ${activeTab === tab.label ? 'text-blue-500 bg-white rounded-lg' : 'text-black'} px-2`}
          >
            <p className='flex items-center justify-center gap-1'>
              <span className='hidden md:block'>{tab.icon}</span>
              <span>{tab.label}</span>
            </p>
          </button>
        ))}
      </AnimatedBackground>
    </div>
  );
}