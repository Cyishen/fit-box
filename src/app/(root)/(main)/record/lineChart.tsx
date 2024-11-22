"use client"


import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

import { useSession } from "next-auth/react"


const categories = ["胸", "背", "腿", "肩", "二頭", "三頭"] as const;
type Category = typeof categories[number];

export type CategoryType = {
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

type WorkoutRecord = {
  date: string;
  totalWeight: number;
  category: string;
};

interface Props {
  userYearSummary: CategoryType[]
}

const LineChart = ({ userYearSummary }: Props) => {
  const { data: session } = useSession()
  const userId = session?.user?.id
// console.log('userYearSummary',userYearSummary)
  const [activeCategory, setActiveCategory] = useState<Category>("胸");
  const [chartData, setChartData] = useState<WorkoutRecord[]>([]);
// console.log('資料',chartData)
  useEffect(() => {
    if (userId) {
      // TODO: 真實數據
      const filteredData: WorkoutRecord[] = userYearSummary.flatMap((summary) =>
        summary.categorySummaries
          .filter((categorySummary) => categorySummary.exerciseCategory === activeCategory)
          .map((categorySummary) => ({
            date: new Date(summary.date).toLocaleDateString(),
            totalWeight: categorySummary.totalCategoryWeight,
            category: categorySummary.exerciseCategory
          }))
      );

      const mergedData: WorkoutRecord[] = filteredData.reduce((acc: WorkoutRecord[], current: WorkoutRecord) => {
        // 查找是否已經存在相同日期和類別的記錄
        const existing = acc.find(item => item.date === current.date && item.category === current.category);
        if (existing) {
          // 如果存在，累加 totalWeight
          existing.totalWeight += current.totalWeight;
        } else {
          // 如果不存在，將這條記錄加入陣列
          acc.push({ ...current });
        }
        return acc;
      }, []);

      setChartData(mergedData);
    } else {
      // 本地
      // 生成過去365天的模擬數據
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 365);

      const mockData = generateMockData(activeCategory, startDate, 180);
      setChartData(mockData);
    }
  }, [activeCategory, userId, userYearSummary]);


  const dataCount = chartData.length > 20 ? 80 : 0;

  const option: EChartsOption = {
    title: {
      text: "訓練量 🏋️",
      subtext: '重量 x 次數 x 組數 kg',
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: function (params: any) {
        const data = params[0].data;
        return `${data[0]}<br/>總重量 ${data[1]}`;
      },
      alwaysShowContent: true,
      position: ['70%', '3%'],
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      shadowColor: 'none',
      padding: 5,
      borderWidth: 0,
      textStyle: {
        fontSize: 11,
        color: 'black',
        fontWeight: 'bold',
      },
      // axisPointer: {
      //   type: 'cross',
      //   label: {
      //     backgroundColor: 'black'
      //   }
      // },
    },
    grid: {
      left: '0%',
      right: '4%',
      bottom: '16%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: '{MM}/{dd}',
        hideOverlap: true,
        fontSize: 8,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: ['10%', '10%'],
      scale: true,
      // name: '重量(kg)',
      nameLocation: 'end',
      nameGap: 30,
      axisLabel: {
        formatter: '{value}kg',
        fontSize: 8,
      },
      nameTextStyle: {
        align: "left",
        fontSize: 12,
      }
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: dataCount,
        end: 100,
        height: 30,
      },
      {
        type: 'slider',
        xAxisIndex: [0],
        start: 50,
        end: 100,
        zoomOnMouseWheel: 'shift'
      }
    ],
    series: [
      {
        name: activeCategory,
        data: chartData.map(item => [item.date, item.totalWeight]),
        type: 'line',
        smooth: false,
        symbol: 'circle',
        symbolSize: 5,
        sampling: 'lttb',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.5)' }, // 起始颜色
              { offset: 0.7, color: 'rgba(130, 180, 250, 0.7)' },
              { offset: 1, color: 'rgba(255, 255, 255, 0.5)' }  // 结束颜色
            ],
            global: false
          }
        },
        itemStyle: {
          color: 'rgb(59, 130, 246)',
          opacity: 0.8,
        },
        lineStyle: { color: 'black', width: 0.2, type: 'solid' },
        markPoint: {
          data: [{ type: 'max', name: '最高' }],
          symbol: 'pin',
          symbolSize: 0,
          label: {
            position: 'top',
            fontWeight: 'bold',
            fontSize: 8
          }
        },
        // markLine: {
        //   data: [{ type: 'average', name: '平均' }],
        //   symbol: 'none',
        //   silent: true,
        //   label: {
        //     position: 'insideEndBottom',
        //     fontWeight: 'bold',
        //     fontSize: 8,
        //   },
        //   lineStyle: {
        //     width: 0.5,
        //     color: 'rgba(0, 0, 0, 0.6)'
        //   }
        // }
      }
    ]
  };


  return (
    <div className='flex flex-col py-1 pb-3 rounded-lg'>
      <div className="flex py-2">
        <div className="flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveCategory(item)}
              className={`flex items-center cursor-pointer py-1 px-5 text-sm 
                  ${activeCategory === item
                  ? 'bg-black text-white'
                  : 'bg-white'
                } whitespace-nowrap rounded-full`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px]">
        {chartData.length === 0 ? (
          <div className='flex justify-center items-center h-full border rounded-lg'>
            無數據
          </div>
        ) : (
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        )}
      </div>
    </div>
  );
};

export default LineChart;




// 亂數產生測試資料
const generateMockData = (category: string, startDate: Date, days: number): WorkoutRecord[] => {
  const data: WorkoutRecord[] = [];
  const baseWeight = Math.floor(Math.random() * 100) + 150;

  for (let i = 0; i < days; i++) {
    // 每 2-4 天生成一條記錄, 先產生 0-1內的數字, 在乘3, 再加上 2, 最後Math.floor取整數
    if (i % Math.floor(Math.random() * 3 + 2) === 0) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + i);

      // 在基礎重量上增加一些隨機變化, 隨機 0-40後減 20 = (-20 到 20)
      const weightVariation = Math.floor(Math.random() * 40) - 20;

      data.push({
        date: currentDate.toISOString().split('T')[0],
        totalWeight: baseWeight + weightVariation,
        category
      });
    }
  }

  return data;
};