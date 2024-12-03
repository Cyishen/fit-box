"use client"


import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

import { useSession } from "next-auth/react"
import type { EChartsOption } from 'echarts';
import { useWorkoutStore } from '@/lib/store';


const categories = ["胸", "背", "腿", "肩", "二頭", "三頭"] as const;
const categoryColors = {
  "胸": "#3B82F6",
  "背": "#4B5563",
  "腿": "#EF4444",
  "肩": "#FBBF24",
  "二頭": "#8B5CF6",
  "三頭": "#10B981"
};

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

type WorkoutCategory = {
  category: string;
  count: number;
  color?: string;
};

export interface Props {
  userThisYearSummary: CategoryType[]
}


const PieChart = ({ userThisYearSummary }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [data, setData] = useState<WorkoutCategory[]>([]);

  // 用戶沒有登入, 本地訓練卡
  const { workoutSessions } = useWorkoutStore();

  // 本地分類
  const localFilter = (local: WorkoutSessionType[]) => {
    const categoryCounts: { [key: string]: number } = {}

    local.forEach(item => {
      item.exercises.forEach(exercise => {
        const isCompletedSets =  exercise.sets.filter(set => set.isCompleted === true);
  
        const category = exercise.exerciseCategory;
        const setsCount = isCompletedSets.length;
        categoryCounts[category] = (categoryCounts[category] || 0) + setsCount;
      });
    });

    return categories.map(category => ({
      category,
      count: categoryCounts[category] || 0,
      color: categoryColors[category as keyof typeof categoryColors]
    }));
  }

  // 資料庫分類
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
      color: categoryColors[category as keyof typeof categoryColors]
    }));
  };

  useEffect(() => {
    if(userId){
      const thisPeriodData = filterUserData(userThisYearSummary);
      setData(thisPeriodData);
    } else {
      // 用戶沒有登入
      const localCard = localFilter(workoutSessions);
      setData(localCard);
    }

  }, [userId, userThisYearSummary, workoutSessions]);


  const currentYear = new Date().getFullYear();
  const hexToRgba = (hex: string, alpha = 0.8) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const option: EChartsOption = {
    title: {
      text: `${currentYear}年訓練分佈`,
      subtext: '訓練組數統計',
      left: 'left',
      top: '0%',
      itemGap: 5,
      textStyle: {
        fontSize: 14
      },
      subtextStyle: {
        fontSize: 10
      }
    },
    tooltip: {
      trigger: 'item',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        const { name, value, percent } = params;
        return `${name}<br/>訓練數 ${value}組<br/>佔比 ${percent}%`;
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      textStyle: {
        fontSize: 11,
        color: 'black',
        fontWeight: 'bold',
      },
    },
    legend: {
      orient: 'horizontal',
      left: 'center',
      top: 'bottom',
      itemGap: 5,
    },
    series: [
      {
        name: '訓練分佈',
        type: 'pie',
        radius: ['30%', '60%'],
        center: ['50%', '45%'],
        top: '10%',
        avoidLabelOverlap: true,
        percentPrecision: 1,
        itemStyle: {
          borderRadius: 10,
        },
        label: {
          show: true,
          formatter: '{b} {d}%',
          position: 'inside',
          fontSize: 12,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: 'black',
          },
        },
        data: data.map(item => ({
          value: item.count,
          name: item.category,
          itemStyle: {
            color: item.color
          },
          tooltip: {
            backgroundColor: hexToRgba(item.color as string, 0.7),
          },
        })),
      }
    ]
  };

  return (
    <div className='flex flex-col sm:flex-row sm:justify-between py-1 sm:py-10 pb-3 rounded-lg border'>
      <div className="h-[300px] sm:flex-1">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
      
      {/* 訓練統計表格 */}
      <div className="mt-4 overflow-x-auto px-1 sm:flex-1">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">部位</th>
              <th className="px-4 py-2 text-right">訓練組數</th>
              <th className="px-4 py-2 text-right">佔比</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => {
              const totalSets = data.reduce((sum, curr) => sum + curr.count, 0);
              let percentage = '0';
          
              if (totalSets > 0) {
                percentage = ((item.count / totalSets) * 100).toFixed(1);
              }
              
              return (
                <tr key={item.category} className="border-b">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2 border"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      {item.category}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">{item.count}組</td>
                  <td className="px-4 py-2 text-right">{percentage}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PieChart;

// 生成今年到目前為止的模擬數據
// const generateCurrentYearData = (): WorkoutCategory[] => {
//   const categories = ["胸", "背", "腿", "肩", "二頭", "三頭"];
  
//   // 獲取今年開始到現在的天數
//   const startOfYear = new Date(new Date().getFullYear(), 0, 1);
//   const today = new Date();
//   const daysSinceStartOfYear = Math.floor((today.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));

//   return categories.map(category => {
//     // 假設平均每週訓練該部位1-2次，每次3-5組
//     const weeksElapsed = Math.floor(daysSinceStartOfYear / 7);
//     const minSets = weeksElapsed * 3; // 最少每週一次，每次3組
//     const maxSets = weeksElapsed * 10; // 最多每週兩次，每次5組

//     return {
//       category,
//       count: Math.floor(Math.random() * (maxSets - minSets + 1)) + minSets,
//       color: categoryColors[category as keyof typeof categoryColors]
//     };
//   });
// };
